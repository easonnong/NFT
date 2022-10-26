const { run } = require("hardhat")

const verify = async (contractAddress, args) => {
  console.log("Verifying contract...")
  try {
    console.log("begin...")
    console.log("addr:", contractAddress)
    console.log("args:", args)
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    })
    console.log("finished...")
  } catch (e) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("Already verified!")
    } else {
      console.log(e)
    }
  }
}

module.exports = {
  verify,
}
