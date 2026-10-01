// To add a new person, import their CSV and add it to this array.

import ailShuhaibCSV from "./ail-shuhaib.csv?raw";
import gulamNaviCSV from "./gulam-navi.csv?raw";
import hashimCSV from "./hashim.csv?raw";
import janibCSV from "./janib.csv?raw";
import nihalPtCSV from "./nihal-pt.csv?raw";
import shakirCSV from "./shakir.csv?raw";
import sinanCSV from "./sinan.csv?raw";

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
