// To add a new person, import their CSV and add it to this array.

import ailShuhaibCSV from "./persons/ail-shuhaib.csv?raw";
import gulamNaviCSV from "./persons/gulam-navi.csv?raw";
import hashimCSV from "./persons/hashim.csv?raw";
import janibCSV from "./persons/janib.csv?raw";
import nihalPtCSV from "./persons/nihal-pt.csv?raw";
import shakirCSV from "./persons/shakir.csv?raw";
import sinanCSV from "./persons/sinan.csv?raw";

import { parsePersonCSV } from "../utils/csvParser";
import type { PersonSchedule } from "../types";

const rawFiles: { name: string; csv: string }[] = [
  {
    name: "Ail Shuhaib",
    csv: ailShuhaibCSV,
  },
  {
    name: "Gulam Navi",
    csv: gulamNaviCSV,
  },
  {
    name: "Hashim",
    csv: hashimCSV,
  },
  {
    name: "Janib",
    csv: janibCSV,
  },
  {
    name: "Nihal PT",
    csv: nihalPtCSV,
  },
  {
    name: "Shakir",
    csv: shakirCSV,
  },
  {
    name: "Sinan",
    csv: sinanCSV,
  },
];

export async function loadAllPersons(): Promise<PersonSchedule[]> {
  return Promise.all(
    rawFiles.map(({ name, csv }) => parsePersonCSV(name, csv))
  );
}
