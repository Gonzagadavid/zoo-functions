/*
eslint no-unused-vars: [
  "error",
  {
    "args": "none",
    "vars": "local",
    "varsIgnorePattern": "data"
  }
]
*/
const data = require('./data');

const { species } = data;

const { employees } = data;

const { hours } = data;

const { prices } = data;

const { Adult: adultPrice, Senior: seniorPrice, Child: childPrice } = prices;

const getSpeciesByIds = (...ids) => species.filter((specie) => ids.includes(specie.id));

function getAnimalsOlderThan(animal, age) {
  const { residents } = species.filter((specie) => specie.name === animal)[0];
  return residents.every((resident) => resident.age >= age);
}

const check = (first, last, name) => first === name || last === name;

function getEmployeeByName(name) {
  return employees.find(({ firstName, lastName }) => check(firstName, lastName, name)) || {};
}

const createEmployee = (personalInfo, associatedWith) => ({ ...personalInfo, ...associatedWith });

const isManager = (idFind) => employees.find(({ id }) => id === idFind).managers.length === 1;

function addEmployee(id, firstName, lastName, managers = [], responsibleFor = []) {
  const employee = { id, firstName, lastName, managers, responsibleFor };
  employees.push(employee);
}

function countAnimals(specie) {
  const animals = species.reduce((object, animal) => {
    const objectQty = object;
    objectQty[animal.name] = animal.residents.length;
    return objectQty;
  }, {});
  return animals[specie] || animals;
}

function calculateEntry(entries = { Adult: 0, Senior: 0, Child: 0 }) {
  const { Adult = 0, Senior = 0, Child = 0 } = entries;
  return Adult * adultPrice + Senior * seniorPrice + Child * childPrice;
}

function generateAnimalsLocation(arrayCoord) {
  return arrayCoord.reduce((object, coord) => {
    const objectCoord = object;
    const arraySpecies = species
      .filter(({ location }) => location === coord)
      .map((specie) => specie.name);
    objectCoord[coord] = arraySpecies;
    return objectCoord;
  }, {});
}

function generateSpeciesName(arrayAnimal, options) {
  return arrayAnimal.reduce((array, specieName) => {
    const object = {};
    let arrayNames = species.find((specie) => specie.name === specieName).residents;

    if (options.sex) arrayNames = arrayNames.filter((animal) => animal.sex === options.sex);

    arrayNames = arrayNames.map((animal) => animal.name);

    if (options.sorted) arrayNames.sort();

    object[specieName] = arrayNames;
    array.push(object);
    return array;
  }, []);
}

function getAnimalMap(options) {
  const coords = ['NE', 'NW', 'SE', 'SW'];
  const animalsLocation = generateAnimalsLocation(coords);
  const namesLocation = {};

  if (!options || !options.includeNames) return animalsLocation;

  coords.forEach((key) => {
    namesLocation[key] = generateSpeciesName(animalsLocation[key], options);
  });
  return namesLocation;
}

function getSchedule(dayName) {
  const informations = {};
  const days = Object.keys(hours);
  const response = {};

  days.forEach((day) => {
    const { open, close } = hours[day];
    const information = open === 0 ? 'CLOSED' : `Open from ${open}am until ${close - 12}pm`;
    informations[day] = information;
  });

  response[dayName] = informations[dayName];
  return dayName ? response : informations;
}

function getOldestFromFirstSpecies(idFind) {
  const { responsibleFor } = employees.find(({ id }) => id === idFind);
  const responsibleSpecies = getSpeciesByIds(...responsibleFor);
  const animalsData = responsibleSpecies.reduce((arrayData, objSpecie) => {
    const { residents } = objSpecie;
    arrayData.push(...residents);
    return arrayData;
  }, []);

  animalsData.sort((a, b) => b.age - a.age);
  return Object.values(animalsData[0]);
}

function increasePrices(percentage) {
  const pricesKeys = Object.keys(prices);

  pricesKeys.forEach((key) => {
    const price = prices[key] + prices[key] * (percentage / 100);
    const decimal = Math.ceil((price - Math.floor(price)) * 100) / 100;
    prices[key] = Math.floor(price) + decimal;
  });
}

function getEmployeeCoverage(idOrName, list = {}) {
  const employeeNames = employees.map((employee) => employee.firstName);

  if (!idOrName) {
    return employeeNames.reduce((emploList, name) => getEmployeeCoverage(name, emploList), {});
  }

  const { firstName, lastName, responsibleFor } = employees.find((employee) => {
    const { firstName: name, lastName: outName, id } = employee;
    return (name === idOrName || outName === idOrName || id === idOrName);
  });
  const copy = list;
  const fullName = `${firstName} ${lastName}`;
  copy[fullName] = responsibleFor.map((idAnimal) => species.find(({ id }) => id === idAnimal).name);
  return list;
}

module.exports = {
  calculateEntry,
  getSchedule,
  countAnimals,
  getAnimalMap,
  getSpeciesByIds,
  getEmployeeByName,
  getEmployeeCoverage,
  addEmployee,
  isManager,
  getAnimalsOlderThan,
  getOldestFromFirstSpecies,
  increasePrices,
  createEmployee,
};
