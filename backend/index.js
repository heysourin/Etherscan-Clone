const express = require("express");
const app = express();
const port = 5001;
const Moralis = require("moralis").default; // The server uses the Moralis API to retrieve the current price of Ethereum (ETH) from the Ethereum mainnet.
const cors = require("cors");

require("dotenv").config({ path: ".env" });

app.use(cors());
app.use(express.json());

const MORALIS_API_KEY = process.env.MORALIS_API_KEY;

//When a GET request is received, the server uses Moralis to get the current price of ETH on the Ethereum mainnet, and returns the response as JSON.
app.get("/getethprice", async (req, res) => {
  try {
    const response = await Moralis.EvmApi.token.getTokenPrice({
      address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
      chain: "0x1",
    });
    return res.status(200).json(response);
  } catch (error) {
    console.log("Something went wrong", error);
    return res.status(400).json(); //If an error occurs during the Moralis API call, the server logs the error and returns a 400 status code (bad request).
  }
});

app.get("/getblockinfo", async (req, res) => {
  try {
    const latestBlock = await Moralis.EvmApi.block.getDateToBlock({
      date: Date.now(),
      chain: "0x1",
    });

    let blockNrOrParentHash = latestBlock.toJSON().block;
    let previousBlockInfo = [];

    for (let i = 0; i < 5; i++) {
      const previousBlockNrs = await Moralis.EvmApi.block.getBlock({
        chain: "0x1",
        blockNumberOrHash: blockNrOrParentHash,
      });

      blockNrOrParentHash = previousBlockNrs.toJSON().parent_hash;
      if (i == 0) {
        previousBlockInfo.push({
          transactions: previousBlockNrs.toJSON().transactions.map((i) => {
            return {
              transactionHash: i.hash,
              time: i.block_timestamp,
              fromAddress: i.from_address,
              toAddress: i.to_address,
              value: i.value,
            };
          }),
        });
      }
      previousBlockInfo.push({
        blockNumber: previousBlockNrs.toJSON().number,
        totalTransactions: previousBlockNrs.toJSON().transaction_count,
        gasUsed: previousBlockNrs.toJSON().gas_used,
        miner: previousBlockNrs.toJSON().miner,
        time: previousBlockNrs.toJSON().timestamp,
      });
    }

    const response = {
      latestBlock: latestBlock.toJSON().block,
      previousBlockInfo,
    };

    return res.status(200).json(response);
  } catch (error) {
    console.log(`Somthing went wrong ${error}`);
    return res.status(400).json();
  }
});

app.get("/address", async (req, res) => {
  try {
    const { query } = req;
    const chain = "0x1";

    const response =
      await Moralis.EvmApi.transaction.getWalletTransactionsVerbose({
        address: query.address,
        chain,
      });

    return res.status(200).json(response);
  } catch (error) {
    console.log(`Something went with address ${error}`);
    return res.status(400).json();
  }
});

//Finally, the server starts listening for API calls using the Moralis.start() method with the provided apiKey and logs a message to the console indicating that it is listening.
Moralis.start({
  apiKey: MORALIS_API_KEY,
}).then(port, () => {
  console.log("Listening for API Calls");
});
