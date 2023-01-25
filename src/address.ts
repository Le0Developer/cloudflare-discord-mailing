import { Address } from "./types";

export function encodeAddress(address: { name: string, address: string }): string {
    if(address.address.startsWith("mailto:"))
        address.address = address.address.substring(7);
	return address.name && address.name !== address.address ? `${address.name} <${address.address}>` : address.address;
}

export function decodeAddress(address: string): Address {
	if(!address.includes("<"))
		return { name: "", address };
	const parts = address.split("<");
	return { name: parts[0].trim(), address: parts[1].split(">")[0].trim() };
}
