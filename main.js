
const SHA256 = require( 'crypto-js/sha256' );

class Transaction {
	constructor( fromAddress, toAdress, amount ) {
		this.fromAddress = fromAddress;
		this.toAddress   = toAdress;
		this.amount      = amount;
	}
}

class Block {
	constructor( timestamp, transactions, previousHash = '' ) {
		this.timestamp    = timestamp;
		this.transactions = transactions;
		this.previousHash = previousHash;
		this.hash         = this.calculateHash();
		this.nonce        = 0;
	}

	calculateHash() {
		return SHA256(
			this.index        +
			this.previousHash +
			this.timestamp    +
			JSON.stringify( this.data ) +
			this.nonce
		).toString();
	}

	mineBlock( difficulty ) {
		while( this.hash.substring( 0, difficulty ) !== Array( difficulty + 1 ).join( '0' ) ) {
			this.nonce++;
			this.hash = this.calculateHash();
		}

		console.log( 'Block mined! :' + this.hash );
	}
}

class Blockchain {
	constructor() {
		this.chain               = [ this.createGenesisBlock() ];
		this.difficulty          = 3;
		this.pendingTransactions = [];
		this.miningReward        = 100;
	}

	createGenesisBlock() {
		return new Block( '31/01/2024', 'Genesis block', '0' );
	}

	getLatestBlock() {
		return this.chain[ this.chain.length - 1 ];
	}

	minePendingTransactions( miningRewardAddress ) {
		/*
		block = [
			Block {
				timestamp,           // Timestamp
				transactions: [      // Several sets of transaction informations
					Transaction {    // 1st transaction
						fromAddress, // From address
						toAddress,   // To address
						amount,      // Amount
					},
					Transaction {    // 2nd transaction
						fromAddress, // From address
						toAddress,   // To address
						amount,      // Amount
					}
				],
				previousHash,       // Previous hash
				hash,               // Current  hash
				nonce,              // Nonce
			}
		]
		*/

		let block = new Block( Date.now(), this.pendingTransactions ) ;
		console.log( '[Blockchain/minePendingTransactions]: Block content:' );
		console.log( block );

		block.mineBlock( this.difficulty );

		this.chain.push( block );
		console.log( '[Blockchain/minePendingTransactions]: Successfully mined!:' );
		console.log( '[Blockchain/minePendingTransactions]: this.chain:' );
		console.log( this.chain );

		this.pendingTransactions = [
			new Transaction( null, miningRewardAddress, this.miningReward )
		];
	}

	createTransaction( transaction ) {
		// transaction: Transaction( <From address>, <To address>, <Amount> )
		// this.pendingTransactions: Array of 'Transaction'
		this.pendingTransactions.push( transaction );
	}

	getBalanceOfAddress( address ) {
		console.log( `Get balance of ${ address }..` )

		let balance = 0;
		for ( var block of this.chain ) {
			console.log( '[Blockchain/getBalanceOfAddress]: Block content:' );
			console.log( block );
			for ( var trans of block.transactions ) {
				if ( trans.fromAddress === address ) { balance -= trans.amount; }
				if ( trans.toAddress   === address ) { balance += trans.amount; }
			}
		}

		return balance;
	}

	isChainValid() {
		for ( var i = 1; i < this.chain.length; i++ ) {
			const currentBlock  = this.chain[ i ];
			const previousBlock = this.chain[ i - 1 ];
			if ( currentBlock.hash         !== currentBlock.calculateHash() ) { return false; }
			if ( currentBlock.previousHash !== previousBlock.hash )           { return false; }
		}

		return true;
	}
}

let shintaroCoin = new Blockchain();
shintaroCoin.createTransaction( new Transaction( 'address1', 'address2', 100 ) );
console.log( 'A new transaction is loaded:' );
console.log( 'shintaroCoin.pendingTransactions:' );
console.log( shintaroCoin.pendingTransactions );

console.log();

shintaroCoin.createTransaction( new Transaction( 'address2', 'address1',  50 ) );
console.log( 'Another new transaction is loaded:' );
console.log( 'shintaroCoin.pendingTransactions:' );
console.log( shintaroCoin.pendingTransactions );

console.log();

console.log( 'Starting the miner...' );
shintaroCoin.minePendingTransactions( 'shintaro-address' );

console.log();

console.log( 'Balance of shintaro is:', shintaroCoin.getBalanceOfAddress( 'shintaro-address' ) );

console.log();

console.log( 'Starting the miner again...' );
shintaroCoin.minePendingTransactions( 'shintaro-address' );

console.log();

console.log( 'Balance of shintaro is:', shintaroCoin.getBalanceOfAddress( 'shintaro-address' ) );