const emptyEncounter = {
  name: "",
  date: "",
  round: 0,
  turn: 0,
  creatures: [
    {
      id: 0,
      name: "",
      initiative: 0,
      hp: 0,
      ac: 0,
      speed: 0,
      action: true,
      bonusAction: true,
      reaction: false,
      concentration: false,
    },
  ],
  initiatives: [],
};
export default emptyEncounter;
