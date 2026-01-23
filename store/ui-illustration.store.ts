import {
  type Illustration,
  ILLUSTRATION_STATUS,
  type ImageDataFormat,
} from "@/models/illustration.model";
import { atom } from "jotai";

type IllustrationStore = {
  illustration?: Illustration | null;
  updatedImages?: ImageDataFormat[];
  updatedStatus?: ILLUSTRATION_STATUS;
};

const initialValue: IllustrationStore = {
  illustration: null,
  updatedImages: [],
  updatedStatus: ILLUSTRATION_STATUS.PENDING,
};

export const UIIllustrationAtom = atom(initialValue);

export const resetIllustrationAtomState = atom(null, (get, set) => {
  set(UIIllustrationAtom, initialValue);
});