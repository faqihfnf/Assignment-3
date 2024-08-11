import UserRepository from "../repositories/user.repository";

const UserServices = {
  getAll: async () => {
    try {
      const allUsers = await UserRepository.getAll();
      return allUsers;
    } catch (error) {
      console.log("User Services Error");
    }
  },
};
export default UserServices;
