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

// function getSchedule(dayName) {
//   // seu código aqui
// }

// function getOldestFromFirstSpecies(id) {
//   // seu código aqui
// }

// function increasePrices(percentage) {
//   // seu código aqui
// }

// function getEmployeeCoverage(idOrName) {
//   // seu código aqui
// }

module.exports = {
  calculateEntry,
  // getSchedule,
  countAnimals,
  getAnimalMap,
  getSpeciesByIds,
  getEmployeeByName,
  // getEmployeeCoverage,
  addEmployee,
  isManager,
  getAnimalsOlderThan,
  // getOldestFromFirstSpecies,
  // increasePrices,
  createEmployee,
};
