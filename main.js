const SHA256 = require('crypto-js/sha256');
const DIFFICULTY = 5;

class Block {
  constructor(index, createdAt, data, prevHash = '') {
    this.index = index;
    this.createdAt = createdAt;
    this.data = data;
    this.prevHash = prevHash;
    this.hash = this.calcHash();
    this.nonce = 0;
  }

  calcHash() {
    return SHA256(
      this.index + this.createdAt + JSON.stringify(this.data) + this.nonce
    ).toString();
  }

  mineBlock(diffLev) {
    while (this.hash.substring(0, diffLev) !== Array(diffLev + 1).join('0')) {
      this.nonce++;
      this.hash = this.calcHash();
    }

    console.log('new block mined ' + this.hash);
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
  }

  createGenesisBlock() {
    return new Block(0, new Date(), 'this is a genesis block', null);
  }

  getLastesBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(block) {
    block.prevHash = this.getLastesBlock().hash;
    block.mineBlock(DIFFICULTY);
    this.chain.push(block);
  }

  isValid() {
    for (let i = 1; i < this.chain.length; ++i) {
      const curBlock = this.chain[i];
      const prevBlock = this.chain[i - 1];

      if (curBlock.prevHash !== prevBlock.hash) return false;
      if (curBlock.hash !== curBlock.calcHash()) return false;
    }
    return true;
  }
}

let coinary = new Blockchain();
coinary.addBlock(new Block(1, new Date(), { amount: 4 }));
coinary.addBlock(new Block(2, new Date(), { amount: 100 }));
