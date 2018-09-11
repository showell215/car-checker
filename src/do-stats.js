'use strict';

module.exports = {
    findDaGoodDeal
}

function findDaGoodDeal (arrayOfDealz) {
    return arrayOfDealz[Math.floor(Math.random() * arrayOfDealz.length)];
};