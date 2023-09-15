import { Account, Client, ID } from "appwrite";

const client = new Client();

client
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('650364230e515bbecf6d');

const account = new Account(client);

const getOtp = async (phone) => {
  const response = await account.createPhoneSession(
    ID.unique(),
    "+91" + phone
  );
  return response.userId;
}

const verifyOtp = async (userId, otp) => {
  try {
    const response = await account.updatePhoneSession(userId, otp)
    return response.userId;
  } catch (error) {
    return error;
  }
}

export { getOtp, verifyOtp };