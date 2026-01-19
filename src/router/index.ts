type User = {
  id: number;
  name?: string;
  role?: string;
  color?: string;
  accesGranted?: boolean;
};

type User2 = {
  id: number;
  name?: string;
  role?: string;
  color?: string;
  accesGranted?: boolean;
};

type User3 = {
  id: number;
  name?: string;
  role?: string;
  color?: string;
  accesGranted?: boolean;
};
const usersMock: User[] = [
  { id: 22, name: "Gabi", role: "user" },
  { id: 44, name: "Kev99", role: "Admin" },
  { id: 60, name: "Rodri22", role: "user" },
  { id: 30, color: "red" },
];

const getOneUser = (id: number) => {
  const users = usersMock.filter((user) => user.id === id);
  if (users.length === 0) {
    console.error("user not found");
    return;
  }
  console.log(users[0]);
  return users[0];
};

getOneUser(22);
export default getOneUser;
