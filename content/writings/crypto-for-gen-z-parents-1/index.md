---
title: "Crypto for Gen Z’s Parents #1"
slug: "crypto-for-gen-z-parents-1"
writingDate: "2022-06-10"
metadata: "crypto, education, blog, learning"
type: "writing"
---

One of my best friends has tasked me with explaining crypto to her mom. I’m not joking:

![Screenshot of Text Convo with Friend About Crypto](./images/text_convo.png)

This’ll be fun. Time to explain crypto to a millennials’ mom.

### An analogy is like an explanation shortcut

Cryptocurrencies, at their root, are a big book of IOU’s. Jill buys some eggs from Jack, and to keep track of their money they go to the big book in the middle of the town square. Jill writes:

> Jill transfers 5 money to Jack | Jill: 10-5=5 money. | Jack: 7+5=12 money | ~Jill Macintosh

To make it official, Jill has to sign her name with her special signature that only she can recreate, it cannot be forged. Jack technically doesn’t have to sign it, he’s the one getting money and who would say no to free money if the other person wants to send it? (I’ll expand on this when I cover wallets in the next entry)

The book uses ink that cannot be erased, and anyone at any time can go to the town square and read through the big book. Everyone can see how much money has been sent to the mayor, Mr. Egg, and by whom.

> 📒 The big book is the ledger. In cryptocurrencies, instead of a single (centralized) big book, many (decentralized) copies of the book exist.

Instead of one book in the town square, every home might keep their own copy. Throughout the day, members of the household record their money transfers. Daily at 8pm, every household meets up to mutually agree upon the new state of the book. House A copies down House B’s transfers, House B might copy House D, and so on until every household has agreed and has the same exact list of transfers.

### Analogies can also confuse

Back in the crypto world, each book copy is a **node**. Every 24 hours from 8pm-8pm would be one **block time**, and the process of coming to a shared agreement is the **consensus mechanism**. Apologies as things start to get more technical here, but bear with me.

As you might imagine, there might be 100s of reasonable ways to come to a consensus, and arguments could be made for longer or shorter block times. Your imagination would be correct, and this is *one of* the main reasons we have MANY cryptocurrencies. Let’s compare the three I’m most familiar with: Bitcoin (BTC), Ethereum (ETH), and Tezos (XTZ):

|                | **Started** | **Block Time**   | **Consensus Mechanism**            |
|----------------|-------------|------------------|------------------------------------|
| **Bitcoin**    | 2009        | ~10 minutes      | Proof-of-Work (PoW)                |
| **Ethereum**   | 2015        | ~14 seconds    | PoW → Proof-of-Stake (PoS)     |
| **Tezos**      | 2018        | ~30 seconds      | Liquid Proof-of-Stake (LPoS)       |


### Proof of Work

With Proof of Work, the nodes (or validator, often they refer to the same thing but not always) use computational power to “validate” the blockchain. There is some computationally very difficult problem that the nodes try to solve, and if they are the first to solve it their version of the next block is added and they receive a reward in the form of the crypto.

> 🧱 Let’s back up. Think of a “block” as a page in the big book. To keep things quick at 8pm, only a single page of transfers is agreed upon to be added. Whatever transfers don’t end up on that page (block) never happened. Yes, this is undesirable. Yes, it also means there is a “max throughput” for almost every blockchain.

This consensus method has faced major blowback recently due to its inherent waste of energy. Bitcoin validators (or miners, yet another synonym that sometimes isn’t a synonym) used roughly **91 terawatt hours** in 2021. That’s similar to Netherland’s total energy use. So yeah, personally not a fan of this consensus mechanism, but there is an argument to be made that it is the most secure. This is partially why Ethereum will be changing their consensus mechanism to Proof of Stake in the future.

### Proof of Stake

With proof of stake, you “stake” some of your coins in exchange for the chance to update the next block and receive a small reward. This method is objectively more difficult to understand in terms of how it works and the math behind why it can still be considered secure, but the gist is that there are incentives to reward “fair” validators and consequences to punish “bad” validators. Other validators have to approve the chosen validator’s proposed block, and if too many validators disagree then the original validator can lose some of their staked coins. This varies greatly depending on the specific chain’s implementation.

The energy costs associated with this are many orders of magnitude lower than Proof-of-Work. No energy is wasted on computationally intensive calculations, instead energy is only used to validate blocks.

### The Liquid Part

An important caveat to staking is that you often need a large number to be able to run your own validator node. In Ethereum, that number will be 32 ETH. In Tezos, it’s 6000 XTZ. Smaller owners can “delegate” their coins to a larger validator, usually in exchange for a percentage fee on the rewards. Sometimes this means your coins are fully locked up and unusable. With Tezos, the liquid part means that you maintain ownership and full usage of your coins even while delegating to a validator node. (Tezos uses the term “bakers” for this. Again, more dumb synonyms).

> Tezos has the additional functionality of governance (i.e. voting on changes to the algorithm or adjacent policies) which the liquid part helps facilitate. The bakers (or node) can vote on the proposals, so easily being able to change your delegation lets you vote indirectly too. It’s sort of like aligning with a political party, you can find a baker who votes how you want.

### Your crypto journey has just begun 🎇

At this point you know the basic differences between some blockchains, as well as the core idea behind a decentralized public ledger. You’ve got a ways to go, but **it’s a big first step**. I’ll dive into wallets next (how does it work, hot vs. cold, wtf is a BIP39 mnemonic phrase) along with some high level benefits, risks, and use cases. Then it’s smart contacts and alien concepts like DeFi and NFTs won’t seem so alien anymore.