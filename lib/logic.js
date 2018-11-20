/**
 * New script file
 */
'use strict';
/**
 * Fund Administrator issuing company's share on behalf of company
 * @param {org.fundadmin.block9systems.ShareIssue} shareIssue
 * @transaction
 */
function onShareIssue(shareIssue) {
    var assetmanager = getCurrentParticipant()
    return getParticipantRegistry('org.fundadmin.block9systems.FundAdministrator')
        .then(function (companyRegistry) {
            return companyRegistry.get(shareIssue.fundadmin.getIdentifier())
                .then(function (issueingCompany) {
                    return addShare(assetmanager, issueingCompany, shareIssue.count)
                        .then(function () {
                            issueingCompany.issuedShareCount += shareIssue.count;
                            return companyRegistry.update(issueingCompany);
                        })
                });
        })
}

/**
 * Transaction proposal for buy or sell
 * @param {org.fundadmin.block9systems.Propose} proposalRequest
 * @transaction
 */
function onProposal(proposalRequest) {
    if (proposalRequest.count <= 0 || proposalRequest.fundadmin == null) {
        //todo : company has to be checked for its existance
        return;//todo : handle error
    }
    var assetmanager = getCurrentParticipant();
    if (proposalRequest.proposalType == 'FOR_SALE') {
        return processSaleOrder(proposalRequest, assetmanager);
    }
    if (proposalRequest.proposalType == 'FOR_BUY') {
        return processBuyOrder(proposalRequest, assetmanager);
    }
}

function processBuyOrder(proposalRequest, buyer) {
    var totalAmount = proposalRequest.count * proposalRequest.price;
    if (buyer.balance < totalAmount) {
        console.log('assetmanager does not have enough balance');
        return; //error has to be thrown
    }
    return query('selectSaleProposalOfCompany', {
        "company": proposalRequest.company.toURI(),
        "price": proposalRequest.price//limit has to be provided
    })
        .then(function (saleProposals) {
            return processProposal(proposalRequest, saleProposals, buyer, "FOR_BUY")
        })
}

function processSaleOrder(proposalRequest, seller) {
    return query('selectShareByUserAndCompany', {
        "owner": seller.toURI(),
        "company": proposalRequest.fundadmin.toURI()
    }).
        then(function (shareRecords) {
            if (shareRecords.length == 0 || shareRecords[0].count < proposalRequest.count) {
                return; //error has to be returned if the trader does not have enough shares as per the claim;            
            }
            return query('selectBuyProposalOfCompany', { //Fix : has to be in ascending order of price
                company: proposalRequest.fundadmin.toURI(),
                price: proposalRequest.price
            })
                .then(function (buyProposals) {
                    return processProposal(proposalRequest, buyProposals, seller, "FOR_SALE")
                })
        })
}

function processProposal(proposal, counterProposals, assetmanager, type) {
    var settlementMap = {}, remainingToProcess = proposal.count, promises = [];
    for (var i = 0; i < counterProposals.length && remainingToProcess > 0; i++) {
        var availableForTransfer = (remainingToProcess <= counterProposals[i].count) ? remainingToProcess : counterProposals[i].count;
        remainingToProcess -= availableForTransfer;
        settlementMap[counterProposals[i].proposalId] = availableForTransfer;
    }
    counterProposals.forEach(function (counterProposal) {
        if (settlementMap[counterProposal.proposalId]) {
            promises.push(
                settleCounterProposal(proposal, assetmanager, counterProposal, type, settlementMap[counterProposal.proposalId], counterProposal.price)
            );
        }
    })
    return Promise.all(promises)
        .then(function () {
            return addNewProposal(assetmanager, proposal.fundadmin, remainingToProcess, type, proposal.price);
        })
}

function assetmanagerFromProposals(proposals) {
    var assetmanagers = [], promises = [];
    getParticipantRegistry('org.fundadmin.block9systems.AssetManager')
        .then(function (assetmanagerRegistry) {
            proposals.forEach(function (proposal) {
                promises.push(function () {
                    assetmanagerRegistry.get(proposal.assetmanager.getIdentifier())
                        .then(function (assetmanager) {
                            assetmanagers.push(assetmanager);
                        })
                })
            })
        })
    return Promise.all(promises)
        .then(function () {
            return assetmanagers;
        })
}

function settleCounterProposal(proposal, firstParty, counterProposal, proposalType, count, stockPrice) {
    if (proposal.fundadmin.getIdentifier() != counterProposal.fundadmin.getIdentifier()) {
        return //throw error; Cannot settle proposals
    }
    if (firstParty.getIdentifier() == counterProposal.assetmanager.getIdentifier()) {
        return //throw error : buy and sell among same trader
    }
    var buyer = (proposalType == "FOR_SALE") ? counterProposal.assetmanager : firstParty;
    var seller = (proposalType == "FOR_SALE") ? firstParty : counterProposal.assetmanager;
    return createTradeEntry(buyer, seller, proposal.fundadmin, count, stockPrice)
        .then(function () {
            return transferOwnership(seller, buyer, proposal.fundadmin, count, stockPrice)
        })
        .then(function () {
            return closeProposalByCount(counterProposal, count);
        })
}

function transferOwnership(seller, buyer, fundadmin, count, stockPrice) {
    return reduceShare(seller, fundadmin, count)
        .then(function () {
            return addShare(buyer, fundadmin, count)
                .then(function () {
                    return transferBalance(buyer, seller, stockPrice * count)
                    //fix : error on insufficient balance has to be handled
                })
        })
        .catch(function (error) {
            console.log('insufficient share. To be handled')
            //fix: insufficient share. To be handled
        })
}

function transferBalance(sender, receiver, amount) {
    return reduceBalance(sender, amount)
        .then(function () {
            return addBalance(receiver, amount);
        })
}

function addBalance(assetmanager, amount) {
    return getParticipantRegistry('org.fundadmin.block9systems.AssetManager')
        .then(function (assetmanagerRegistry) {
            assetmanagerRegistry.get(assetmanager.getIdentifier())
                .then(function (assetmanager) {
                    assetmanager.balance += amount;
                    return assetmanagerRegistry.update(assetmanager);
                })
        })
}

function reduceBalance(assetmanager, amount) {
    return getParticipantRegistry('org.fundadmin.block9systems.Assetmanager')
        .then(function (assetmanagerRegistry) {
            assetmanagerRegistry.get(assetmanager.getIdentifier())
                .then(function (assetmanager) {
                    if (assetmanager.balance - amount < 0) {
                        return; //throw error; Insufficient balance
                    }
                    assetmanager.balance -= amount;
                    return assetmanagerRegistry.update(assetmanager);
                })
        })
}

function createTradeForProposal(proposal, proposalType, counterProposals, settlementList) {
    var tradeCreatePromises = [];
    counterProposals.forEach(function (counterProposal) {
        if (settlementList[counterProposal.proposalId]) {
            var buyer = (proposalType == "FOR_SALE") ? counterProposal.assetmanager : proposal.assetmanager;
            var seller = (proposalType == "FOR_SALE") ? proposal.assetmanager : counterProposal.assetmanager;
            tradeCreatePromises.push(
                createTradeEntry(buyer, seller, proposal.fundadmin,
                    settlementList[counterProposal.proposalId],
                    counterProposal.price)
            )
        }
    })
    return Promise.all(tradeCreatePromises);
}

function createTradeEntry(buyer, seller, fundadmin, count, price) {
    var factory = getFactory();
    var trade = factory.newResource("org.fundadmin.block9systems", "Trade", seller.getIdentifier() + "_" +
        buyer.getIdentifier() + "_" + fundadmin.getIdentifier() + new Date().getTime().toString());
    trade.fundadmin = fundadmin;
    trade.buyer = buyer;
    trade.seller = seller;
    trade.count = count;
    trade.price = price;
    return getAssetRegistry("org.fundadmin.block9systems.Trade")
        .then(function (tradeRgistry) {
            return tradeRgistry.add(trade)
        })
}

function addShare(holder, fundadmin, count) {
    return getAssetRegistry('org.fundadmin.block9systems.Share')
        .then(function (shareRegistry) {
            return query('selectShareByUserAndCompany', {
                owner: holder.toURI(),
                company: fundadmin.toURI()
            })
                .then(function (shareEntry) {
                    if (shareEntry.length == 0) {
                        return createShare(holder, fundadmin, count, shareRegistry);
                    } else {
                        return updateShare(shareEntry[0], shareRegistry, count);
                    }
                })
        })
}

function reduceShare(holder, fundadmin, count) {
    return getAssetRegistry('org.fundadmin.block9systems.Share')
        .then(function (shareRegistry) {
            return query('selectShareByUserAndCompany', {
                owner: holder.toURI(),
                company: fundadmin.toURI()
            })
                .then(function (shareEntry) {
                    if (shareEntry.length == 0 || shareEntry[0].count < count) {
                        return //throw error; Not enough share
                    }
                    if (shareEntry[0].count == count) {
                        return removeShare(shareEntry[0], shareRegistry);
                    }
                    return updateShare(shareEntry[0], shareRegistry, -1 * count);
                })
        })
}

function createShare(holder, fundadmin, count, shareRegistry) {
    var share = getFactory().newResource("org.fundadmin.block9systems", "Share", holder.getIdentifier() + "_" +
        fundadmin.getIdentifier());
    share.count = count;
    share.fundadmin = fundadmin;
    share.holder = holder;
    return shareRegistry.add(share);
}

function updateShare(share, shareRegistry, count) {
    share.count += count;
    return shareRegistry.update(share);
}

function removeShare(share, shareRegistry) {
    return shareRegistry.remove(share)
}

function addNewProposal(assetmanager, fundadmin, count, type, price) {
    if (count <= 0) {
        return;
    }
    var proposal = getFactory().newResource("org.fundadmin.block9systems", "Proposal",
        assetmanager.getIdentifier() + "_" +
        new Date().getTime().toString());
    proposal.count = count;
    proposal.type = type;
    proposal.price = price;
    proposal.fundadmin = fundadmin;
    proposal.assetmanager = assetmanager;
    return addProposal(proposal);
}

function addProposal(proposal) {
    return getAssetRegistry('org.fundadmin.block9systems.Proposal')
        .then(function (proposalRegistry) {
            return proposalRegistry.add(proposal);
        })
}

function removeProposal(proposal) {
    return getAssetRegistry('org.fundadmin.block9systems.Proposal')
        .then(function (proposalRegistry) {
            return proposalRegistry.remove(proposal.getIdentifier());
        })
}

function updateProposalCount(prposal, count) {
    return getAssetRegistry('org.fundadmin.block9systems.Proposal')
        .then(function (proposalRegistry) {
            proposal.count = count;
            return proposalRegistry.update(proposal);
        })
}

function closeProposalByCount(proposal, count) {
    if (proposal.count < count) {
        return// insufficient ; throw error
    }
    return getAssetRegistry('org.fundadmin.block9systems.Proposal')
        .then(function (proposalRegistry) {
            if (proposal.count - count == 0) {
                return proposalRegistry.remove(proposal.getIdentifier())
            }
            proposal.count -= count;
            return proposalRegistry.update(proposal);
        })
}
