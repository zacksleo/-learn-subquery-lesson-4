import { AccountId, Balance } from "@polkadot/types/interfaces";
import { SubstrateEvent } from "@subql/types";
import { Account, Transfer } from "../types";

export async function handleTransfer(event: SubstrateEvent): Promise<void> {
    const record = new Transfer(`${event.block.block.header.number.toString()}-${event.idx}`)

    const { event: { data: [fromAccount, toAccount, amount] } } = event;

    await makeSureAccount((toAccount as AccountId).toString());

    record.from = (fromAccount as AccountId).toString();
    record.toId = (toAccount as AccountId).toString();
    record.amount = (amount as Balance).toBigInt();
    await record.save();
}

async function makeSureAccount(accountId: string): Promise<void> {
    const checkAccount = await Account.get(accountId);
    if (!checkAccount) {
        await new Account(accountId).save();
    }
}