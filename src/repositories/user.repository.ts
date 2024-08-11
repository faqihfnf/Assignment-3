import { User } from "../models/user.schema";

const UserRepository = {
  getAll: async () => {
    try {
      const allUsers = await User.find();
      return allUsers;
    } catch (error) {
      console.log(error);
      console.log("User Repository Error");
    }
  },
};

export default UserRepository;
