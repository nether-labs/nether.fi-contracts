const BN = require('bn.js');

require('dotenv').config();

const {
    USDG,
    NEFI,
    ESNEFI,
    BNNEFI,
    NLP,
    REWARD_TRACKER_sNEFI,
    REWARD_TRACKER_sbNEFI,
    REWARD_TRACKER_sbfNEFI,
    REWARD_TRACKER_fNLP,
    REWARD_TRACKER_fsNLP,
    NLP_MANAGER,
    VESTER_NEFI,
    VESTER_NLP,
    REWARD_ROUTER
} = process.env;

const USDGCode = artifacts.require("USDG");
const NEFICode = artifacts.require("NEFI");
const EsNEFI = artifacts.require("EsNEFI");
const BnNEFI = artifacts.require("MintableBaseToken");
const NLPCode = artifacts.require("NLP");
const RewardTracker = artifacts.require("RewardTracker");
const Vester = artifacts.require("Vester");
const NlpManager = artifacts.require("NlpManager");

const debug = "true";

const ZERO = new BN(0);
const ONE = new BN(1);
const TWO = new BN(2);
const THREE = new BN(3);

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

module.exports = async function (deployer, network) {
    if (network == "test" || network == "development")
        return;

    let USDGInst = await USDGCode.at(USDG);
    await USDGInst.addVault(NLP_MANAGER);

    let NEFIInst = await NEFICode.at(NEFI);
    await NEFIInst.setHandler(REWARD_TRACKER_sNEFI, true);

    let EsNEFIInst = await EsNEFI.at(ESNEFI);
    await EsNEFIInst.setInPrivateTransferMode(true);
    await EsNEFIInst.setHandler(REWARD_TRACKER_sNEFI, true);
    await EsNEFIInst.setHandler(VESTER_NEFI, true);
    await EsNEFIInst.setHandler(VESTER_NLP, true);

    let BnNEFIInst = await BnNEFI.at(BNNEFI);
    await BnNEFIInst.setHandler(REWARD_TRACKER_sbfNEFI, true);

    let NLPInst = await NLPCode.at(NLP);
    await NLPInst.setInPrivateTransferMode(true);
    await NLPInst.setMinter(NLP_MANAGER, true);
    await NLPInst.setHandler(REWARD_TRACKER_fNLP, true);

    let sNEFI = await RewardTracker.at(REWARD_TRACKER_sNEFI);
    await sNEFI.setInPrivateTransferMode(true);
    await sNEFI.setInPrivateStakingMode(true);
    await sNEFI.setHandler(REWARD_ROUTER, true);
    await sNEFI.setHandler(REWARD_TRACKER_sbNEFI, true);

    let sbNEFI = await RewardTracker.at(REWARD_TRACKER_sbNEFI);
    await sbNEFI.setInPrivateTransferMode(true);
    await sbNEFI.setInPrivateStakingMode(true);
    await sbNEFI.setInPrivateClaimingMode(true);
    await sbNEFI.setHandler(REWARD_ROUTER, true);
    await sbNEFI.setHandler(REWARD_TRACKER_sbfNEFI, true);

    let sbfNEFI = await RewardTracker.at(REWARD_TRACKER_sbfNEFI);
    await sbfNEFI.setInPrivateTransferMode(true);
    await sbfNEFI.setInPrivateStakingMode(true);
    await sbfNEFI.setHandler(REWARD_ROUTER, true);
    await sbfNEFI.setHandler(VESTER_NEFI, true);

    let fNLP = await RewardTracker.at(REWARD_TRACKER_fNLP);
    await fNLP.setInPrivateTransferMode(true);
    await fNLP.setInPrivateStakingMode(true);
    await fNLP.setHandler(REWARD_ROUTER, true);
    await fNLP.setHandler(REWARD_TRACKER_fsNLP, true);

    let fsNLP = await RewardTracker.at(REWARD_TRACKER_fsNLP);
    await fsNLP.setInPrivateTransferMode(true);
    await fsNLP.setInPrivateStakingMode(true);
    await fsNLP.setHandler(REWARD_ROUTER, true);
    await fsNLP.setHandler(VESTER_NLP, true);

    let VesterNEFI = await Vester.at(VESTER_NEFI);
    await VesterNEFI.setHandler(REWARD_ROUTER, true);
    let VesterNLP = await Vester.at(VESTER_NLP);
    await VesterNLP.setHandler(REWARD_ROUTER, true);

    let NlpManagerInst = await NlpManager.at(NLP_MANAGER);
    await NlpManagerInst.setInPrivateMode(true);
    await NlpManagerInst.setHandler(REWARD_ROUTER, true);

    console.log("Settings done");
};