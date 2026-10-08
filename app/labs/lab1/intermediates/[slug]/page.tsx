import type { ComponentType } from "react";
import Lab1Starter from "../1-2-4-Lab1Starter";
import HeadingTags from "../1-3-1-HeadingTags";
import ParagraphUnwrapped from "../1-3-2a-ParagraphUnwrapped";
import ParagraphWrapped from "../1-3-2b-ParagraphWrapped";
import OrderedListPlain from "../1-3-3a-OrderedListPlain";
import OrderedListTagged from "../1-3-3b-OrderedListTagged";
import OrderedListFavorite from "../1-3-3c-OrderedListFavorite";
import UnorderedLists from "../1-3-4-UnorderedLists";
import Tables from "../1-3-5-Tables";
import Images from "../1-3-6-Images";
import TextFields from "../1-3-7a-TextFields";
import TextareaField from "../1-3-7b-Textarea";
import RadioButtons from "../1-3-7c-RadioButtons";
import RadioTwoGroups from "../1-3-7c2-RadioTwoGroups";
import RadioLabelPatterns from "../1-3-7c3-RadioLabelPatterns";
import Checkboxes from "../1-3-7d-Checkboxes";
import Dropdowns from "../1-3-7e-Dropdowns";
import DropdownSingle from "../1-3-7e1-DropdownSingle";
import OtherFieldTypes from "../1-3-7f-OtherFieldTypes";
import FieldEmail from "../1-3-7f1-FieldEmail";
import FieldEmailNumber from "../1-3-7f2-FieldEmailNumber";
import FieldEmailNumberRange from "../1-3-7f3-FieldEmailNumberRange";
import Buttons from "../1-3-7g-Buttons";
import FormsComplete from "../1-3-7-FormsComplete";
import HighlightedParagraph from "../1-3-8-HighlightedParagraph";
import HighlightedBox from "../1-3-9-HighlightedBox";
import AnchorTag from "../1-3-10-AnchorTag";
import AnchorHrefPatterns from "../1-3-10b-AnchorHrefPatterns";
import LabsIndex from "../1-3-11-LabsIndex";
import LabsLayoutDemo from "../1-3-12-LabsLayout";
import LabsNameGithub from "../1-5-LabsNameGithub";
import { notFound } from "next/navigation";

const STEPS: Record<string, ComponentType> = {
  "1-2-4-Lab1Starter": Lab1Starter,
  "1-3-1-HeadingTags": HeadingTags,
  "1-3-2a-ParagraphUnwrapped": ParagraphUnwrapped,
  "1-3-2b-ParagraphWrapped": ParagraphWrapped,
  "1-3-3a-OrderedListPlain": OrderedListPlain,
  "1-3-3b-OrderedListTagged": OrderedListTagged,
  "1-3-3c-OrderedListFavorite": OrderedListFavorite,
  "1-3-4-UnorderedLists": UnorderedLists,
  "1-3-5-Tables": Tables,
  "1-3-6-Images": Images,
  "1-3-7a-TextFields": TextFields,
  "1-3-7b-Textarea": TextareaField,
  "1-3-7c-RadioButtons": RadioButtons,
  "1-3-7c2-RadioTwoGroups": RadioTwoGroups,
  "1-3-7c3-RadioLabelPatterns": RadioLabelPatterns,
  "1-3-7d-Checkboxes": Checkboxes,
  "1-3-7e-Dropdowns": Dropdowns,
  "1-3-7e1-DropdownSingle": DropdownSingle,
  "1-3-7f-OtherFieldTypes": OtherFieldTypes,
  "1-3-7f1-FieldEmail": FieldEmail,
  "1-3-7f2-FieldEmailNumber": FieldEmailNumber,
  "1-3-7f3-FieldEmailNumberRange": FieldEmailNumberRange,
  "1-3-7g-Buttons": Buttons,
  "1-3-7-FormsComplete": FormsComplete,
  "1-3-8-HighlightedParagraph": HighlightedParagraph,
  "1-3-9-HighlightedBox": HighlightedBox,
  "1-3-10-AnchorTag": AnchorTag,
  "1-3-10b-AnchorHrefPatterns": AnchorHrefPatterns,
  "1-3-11-LabsIndex": LabsIndex,
  "1-3-12-LabsLayout": LabsLayoutDemo,
  "1-5-LabsNameGithub": LabsNameGithub,
};

export default async function IntermediateStepPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const Step = STEPS[slug];
  if (!Step) notFound();
  return <Step />;
}
