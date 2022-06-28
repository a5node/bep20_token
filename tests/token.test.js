// Right click on the script name and hit "Run" to execute
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Token", function () {
  it("test initial value", async function () {
    const Token = await ethers.getContractFactory("Token");
    const token = await Token.deploy();
    await token.deployed();
    console.log('token deployed at:'+ token.address)
    expect((await token.total_supply()).toNumber()).to.equal(1500);
  });

  it("Deployment should assign the total supply of tokens to the owner", async function () {
    const [owner] = await ethers.getSigners();
    
    const Token = await ethers.getContractFactory("Token");

    const token = await Token.deploy();

    const ownerBalance = await token.balanceOf(owner.address);
    expect(await token.total_supply()).to.equal(ownerBalance);
  });

  it("Should transfer tokens between accounts", async function() {
    const [owner, addr1, addr2] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("Token");

    const hardhatToken = await Token.deploy();

    expect(await hardhatToken.balanceOf(owner.address)).to.equal(1500);

    // Transfer 50 tokens from owner to addr1
    await hardhatToken.transfer(addr1.address, 50);
    expect(await hardhatToken.balanceOf(addr1.address)).to.equal(50);

    // Transfer 50 tokens from addr1 to addr2 using connect + transform
    await hardhatToken.connect(addr1).transfer(addr2.address, 50);
    expect(await hardhatToken.balanceOf(addr2.address)).to.equal(50);

    expect(await hardhatToken.balanceOf(addr1.address)).to.equal(0);
    expect(await hardhatToken.balanceOf(owner.address)).to.equal(1450);
  });

  it("Should transfer tokens between accounts using approval", async function() {
    const [owner, addr1, addr2] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("Token");

    const hardhatToken = await Token.deploy();

    expect(await hardhatToken.balanceOf(owner.address)).to.equal(1500);

    // Transfer 50 tokens from owner to addr1
    await hardhatToken.transfer(addr1.address, 50);
    expect(await hardhatToken.balanceOf(addr1.address)).to.equal(50);

    // Transfer 50 tokens from addr1 to addr2 using transferFrom, need approval first
    const setValue = await hardhatToken.connect(addr1).approve(owner.address, 50);
    //await setValue.wait();
    
    await hardhatToken.connect(owner).transferFrom(addr1.address, addr2.address, 50);
    expect(await hardhatToken.balanceOf(addr2.address)).to.equal(50);
  });
});