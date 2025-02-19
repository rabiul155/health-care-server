const createAdminDB = async (user: any) => {
  return user;
};

const getUserDB = async () => {
  return {
    message: "hello user",
  };
};

export const userServices = {
  createAdminDB,
  getUserDB,
};
