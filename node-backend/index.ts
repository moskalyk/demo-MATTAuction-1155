import { sequence } from '0xsequence'

// Create your rpc relayer instance with relayer node you want to use
const auth = async (sequenceWalletAddress: string, ethAuthProofString: string) => {

    const chainId = 'polygon'
    const walletAddress = sequenceWalletAddress

    const api = new sequence.api.SequenceAPIClient('https://api.sequence.app')
    
    const { isValid } = await api.isValidETHAuthProof({
        chainId, walletAddress, ethAuthProofString
    })

    console.log(isValid)

    if(!isValid) throw new Error('invalid wallet auth')

    return isValid

}

export {
    auth,
}