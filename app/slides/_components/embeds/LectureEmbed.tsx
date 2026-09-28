import type { LectureEmbedId } from "@/lib/lectures/types";
import AlertButtonEmbed from "./AlertButtonEmbed";
import AnchorsEmbed from "./AnchorsEmbed";
import ButtonsEmbed from "./ButtonsEmbed";
import CheckboxesEmbed from "./CheckboxesEmbed";
import DropdownsEmbed from "./DropdownsEmbed";
import FileFieldEmbed from "./FileFieldEmbed";
import HashTocEmbed from "./HashTocEmbed";
import HeadingScaleEmbed from "./HeadingScaleEmbed";
import HeadingTagsEmbed from "./HeadingTagsEmbed";
import HtmlSkeletonEmbed from "./HtmlSkeletonEmbed";
import Lab1StubEmbed from "./Lab1StubEmbed";
import LabsIndexEmbed from "./LabsIndexEmbed";
import {
  KambazAccountNavEmbed,
  KambazLandingEmbed,
  KambazProfileEmbed,
  KambazSigninEmbed,
  KambazSignupEmbed,
} from "./KambazAccountEmbeds";
import {
  KambazDashboardEmbed,
  KambazNavigationEmbed,
} from "./KambazChromeEmbeds";
import {
  KambazAssignmentEditorEmbed,
  KambazAssignmentsEmbed,
  KambazCoursesEmbed,
  KambazHomeEmbed,
  KambazModulesEmbed,
} from "./KambazCourseEmbeds";
import LabsLayoutEmbed from "./LabsLayoutEmbed";
import LinkNavEmbed from "./LinkNavEmbed";
import ListTagsEmbed from "./ListTagsEmbed";
import MailtoTelEmbed from "./MailtoTelEmbed";
import ParagraphTagEmbed from "./ParagraphTagEmbed";
import RadioButtonsEmbed from "./RadioButtonsEmbed";
import TablesEmbed from "./TablesEmbed";
import TextareaEmbed from "./TextareaEmbed";
import TextFieldsEmbed from "./TextFieldsEmbed";
import TypedFieldsEmbed from "./TypedFieldsEmbed";
import UserCardEmbed from "./UserCardEmbed";
import WelcomeHomeEmbed from "./WelcomeHomeEmbed";
import {
  CssBackgroundEmbed,
  CssBordersEmbed,
  CssBoxModelEmbed,
  CssClassSelectorsEmbed,
  CssCornersEmbed,
  CssDimensionsEmbed,
  CssDisplayEmbed,
  CssFlexGrowEmbed,
  CssFlexRowEmbed,
  CssFlexWidthEmbed,
  CssFloatEmbed,
  CssForegroundEmbed,
  CssGradientEmbed,
  CssGridLayoutEmbed,
  CssIdSelectorsEmbed,
  CssImportEmbed,
  CssMarginsEmbed,
  CssMediaQueriesEmbed,
  CssPaddingEmbed,
  CssPositionAbsoluteEmbed,
  CssPositionFixedEmbed,
  CssPositionRelativeEmbed,
  CssRotateEmbed,
  CssStructureSelectorsEmbed,
  CssStyleAttrEmbed,
  CssZindexEmbed,
} from "./CssLabEmbeds";
import {
  ReactIconsEmbed,
  TailwindBackgroundsEmbed,
  TailwindFiltersEmbed,
  TailwindFlexEmbed,
  TailwindGridsEmbed,
  TailwindResponsiveBreakpointEmbed,
  TailwindResponsiveEmbed,
  TailwindResponsiveFlexEmbed,
  TailwindResponsiveGridEmbed,
  TailwindResponsiveShowHideEmbed,
  TailwindResponsiveSpacingEmbed,
  TailwindSpacingEmbed,
  TailwindTypographyEmbed,
} from "./TailwindLabEmbeds";
import {
  KambazStyledAssignmentsEmbed,
  KambazStyledCourseNavEmbed,
  KambazStyledDashboardEmbed,
  KambazStyledHomeEmbed,
  KambazStyledModulesEmbed,
  KambazStyledNavEmbed,
  KambazStyledPeopleEmbed,
  KambazStyledSigninEmbed,
} from "./KambazStylingEmbeds";
import {
  JsAddEmbed,
  JsArrayAddRemoveEmbed,
  JsArrayIndexEmbed,
  JsArrowFunctionsEmbed,
  JsBooleansEmbed,
  JsClassesEmbed,
  JsClientComponentEmbed,
  JsConditionalIfElseEmbed,
  JsConditionalInlineEmbed,
  JsDestructingEmbed,
  JsDestructingImportsEmbed,
  JsFilterEmbed,
  JsFindEmbed,
  JsFindIndexEmbed,
  JsForLoopsEmbed,
  JsFunctionDestructingEmbed,
  JsHighlightEmbed,
  JsHouseEmbed,
  JsIfElseEmbed,
  JsImpliedReturnEmbed,
  JsIncludesSomeEveryEmbed,
  JsJsonStringifyEmbed,
  JsLegacyFunctionsEmbed,
  JsMapEmbed,
  JsNullUndefinedEmbed,
  JsOptionalChainingEmbed,
  JsPathParametersEmbed,
  JsReduceEmbed,
  JsServerComponentEmbed,
  JsSimpleArraysEmbed,
  JsSpreaderEmbed,
  JsSquareEmbed,
  JsStylesEmbed,
  JsTemplateLiteralsEmbed,
  JsTernaryEmbed,
  JsTodoListEmbed,
  JsVariableTypesEmbed,
  JsVariablesEmbed,
  Lab3StubEmbed,
} from "./Lab3Embeds";
import {
  ArrayStateEmbed,
  BooleanStateEmbed,
  ClickEventEmbed,
  ContextCounterEmbed,
  CounterBrokenEmbed,
  CounterEmbed,
  DateStateEmbed,
  KambazCoursesCrudEmbed,
  Lab4StubEmbed,
  ObjectStateEmbed,
  ParentChildStateEmbed,
  PassingDataEmbed,
  PassingFunctionsEmbed,
  PropDrillingEmbed,
  StringStateEmbed,
  UrlEncodingEmbed,
  UseEffectEmbed,
  ZustandCounterEmbed,
  ZustandTodosEmbed,
} from "./Lab4Embeds";
import {
  Lab5CalculatorEmbed,
  Lab5EnvEmbed,
  Lab5HelloEmbed,
} from "./Lab5Embeds";
import {
  Lab6StatusEmbed,
  Lab6TodosEmbed,
  Lab6UsersEmbed,
} from "./Lab6Embeds";
import {
  GrokModulesEmbed,
  GrokSparkleEmbed,
  OpenAIChatEmbed,
  OpenAIImagesEmbed,
  OpenAIVisionEmbed,
  YouTubeDetailsEmbed,
  YouTubeLessonEmbed,
  YouTubeSearchEmbed,
} from "./ProjectApiEmbeds";

export default function LectureEmbed({ id }: { id: LectureEmbedId }) {
  switch (id) {
    case "user-card":
      return <UserCardEmbed />;
    case "welcome-home":
      return <WelcomeHomeEmbed />;
    case "lab1-stub":
      return <Lab1StubEmbed />;
    case "link-nav":
      return <LinkNavEmbed />;
    case "heading-tags":
      return <HeadingTagsEmbed />;
    case "paragraph-tag":
      return <ParagraphTagEmbed />;
    case "list-tags":
      return <ListTagsEmbed />;
    case "tables":
      return <TablesEmbed />;
    case "text-fields":
      return <TextFieldsEmbed />;
    case "anchors":
      return <AnchorsEmbed />;
    case "labs-index":
      return <LabsIndexEmbed />;
    case "html-skeleton":
      return <HtmlSkeletonEmbed />;
    case "heading-scale":
      return <HeadingScaleEmbed />;
    case "radio-buttons":
      return <RadioButtonsEmbed />;
    case "file-field":
      return <FileFieldEmbed />;
    case "typed-fields":
      return <TypedFieldsEmbed />;
    case "mailto-tel":
      return <MailtoTelEmbed />;
    case "hash-toc":
      return <HashTocEmbed />;
    case "textarea":
      return <TextareaEmbed />;
    case "checkboxes":
      return <CheckboxesEmbed />;
    case "dropdowns":
      return <DropdownsEmbed />;
    case "alert-button":
      return <AlertButtonEmbed />;
    case "buttons":
      return <ButtonsEmbed />;
    case "labs-layout":
      return <LabsLayoutEmbed />;
    case "kambaz-landing":
      return <KambazLandingEmbed />;
    case "kambaz-signin":
      return <KambazSigninEmbed />;
    case "kambaz-signup":
      return <KambazSignupEmbed />;
    case "kambaz-profile":
      return <KambazProfileEmbed />;
    case "kambaz-account-nav":
      return <KambazAccountNavEmbed />;
    case "kambaz-dashboard":
      return <KambazDashboardEmbed />;
    case "kambaz-navigation":
      return <KambazNavigationEmbed />;
    case "kambaz-courses":
      return <KambazCoursesEmbed />;
    case "kambaz-modules":
      return <KambazModulesEmbed />;
    case "kambaz-home":
      return <KambazHomeEmbed />;
    case "kambaz-assignments":
      return <KambazAssignmentsEmbed />;
    case "kambaz-assignment-editor":
      return <KambazAssignmentEditorEmbed />;
    case "css-style-attr":
      return <CssStyleAttrEmbed />;
    case "css-import":
      return <CssImportEmbed />;
    case "css-id-selectors":
      return <CssIdSelectorsEmbed />;
    case "css-class-selectors":
      return <CssClassSelectorsEmbed />;
    case "css-structure-selectors":
      return <CssStructureSelectorsEmbed />;
    case "css-foreground":
      return <CssForegroundEmbed />;
    case "css-background":
      return <CssBackgroundEmbed />;
    case "css-borders":
      return <CssBordersEmbed />;
    case "css-padding":
      return <CssPaddingEmbed />;
    case "css-margins":
      return <CssMarginsEmbed />;
    case "css-box-model":
      return <CssBoxModelEmbed />;
    case "css-corners":
      return <CssCornersEmbed />;
    case "css-dimensions":
      return <CssDimensionsEmbed />;
    case "css-display":
      return <CssDisplayEmbed />;
    case "css-position-relative":
      return <CssPositionRelativeEmbed />;
    case "css-position-absolute":
      return <CssPositionAbsoluteEmbed />;
    case "css-position-fixed":
      return <CssPositionFixedEmbed />;
    case "css-zindex":
      return <CssZindexEmbed />;
    case "css-float":
      return <CssFloatEmbed />;
    case "css-grid-layout":
      return <CssGridLayoutEmbed />;
    case "css-flex-row":
      return <CssFlexRowEmbed />;
    case "css-flex-grow":
      return <CssFlexGrowEmbed />;
    case "css-flex-width":
      return <CssFlexWidthEmbed />;
    case "css-media-queries":
      return <CssMediaQueriesEmbed />;
    case "css-rotate":
      return <CssRotateEmbed />;
    case "css-gradient":
      return <CssGradientEmbed />;
    case "react-icons":
      return <ReactIconsEmbed />;
    case "tw-spacing":
      return <TailwindSpacingEmbed />;
    case "tw-typography":
      return <TailwindTypographyEmbed />;
    case "tw-backgrounds":
      return <TailwindBackgroundsEmbed />;
    case "tw-filters":
      return <TailwindFiltersEmbed />;
    case "tw-flex":
      return <TailwindFlexEmbed />;
    case "tw-grids":
      return <TailwindGridsEmbed />;
    case "tw-responsive-breakpoint":
      return <TailwindResponsiveBreakpointEmbed />;
    case "tw-responsive-show-hide":
      return <TailwindResponsiveShowHideEmbed />;
    case "tw-responsive-flex":
      return <TailwindResponsiveFlexEmbed />;
    case "tw-responsive-grid":
      return <TailwindResponsiveGridEmbed />;
    case "tw-responsive-spacing":
      return <TailwindResponsiveSpacingEmbed />;
    case "tw-responsive":
      return <TailwindResponsiveEmbed />;
    case "kambaz-styled-nav":
      return <KambazStyledNavEmbed />;
    case "kambaz-styled-dashboard":
      return <KambazStyledDashboardEmbed />;
    case "kambaz-styled-course-nav":
      return <KambazStyledCourseNavEmbed />;
    case "kambaz-styled-modules":
      return <KambazStyledModulesEmbed />;
    case "kambaz-styled-home":
      return <KambazStyledHomeEmbed />;
    case "kambaz-styled-people":
      return <KambazStyledPeopleEmbed />;
    case "kambaz-styled-assignments":
      return <KambazStyledAssignmentsEmbed />;
    case "kambaz-styled-signin":
      return <KambazStyledSigninEmbed />;
    case "lab3-stub":
      return <Lab3StubEmbed />;
    case "js-variables":
      return <JsVariablesEmbed />;
    case "js-variable-types":
      return <JsVariableTypesEmbed />;
    case "js-booleans":
      return <JsBooleansEmbed />;
    case "js-if-else":
      return <JsIfElseEmbed />;
    case "js-ternary":
      return <JsTernaryEmbed />;
    case "js-conditional-if-else":
      return <JsConditionalIfElseEmbed />;
    case "js-conditional-inline":
      return <JsConditionalInlineEmbed />;
    case "js-null-undefined":
      return <JsNullUndefinedEmbed />;
    case "js-legacy-functions":
      return <JsLegacyFunctionsEmbed />;
    case "js-arrow-functions":
      return <JsArrowFunctionsEmbed />;
    case "js-implied-return":
      return <JsImpliedReturnEmbed />;
    case "js-template-literals":
      return <JsTemplateLiteralsEmbed />;
    case "js-simple-arrays":
      return <JsSimpleArraysEmbed />;
    case "js-array-index":
      return <JsArrayIndexEmbed />;
    case "js-array-add-remove":
      return <JsArrayAddRemoveEmbed />;
    case "js-for-loops":
      return <JsForLoopsEmbed />;
    case "js-map":
      return <JsMapEmbed />;
    case "js-find":
      return <JsFindEmbed />;
    case "js-find-index":
      return <JsFindIndexEmbed />;
    case "js-filter":
      return <JsFilterEmbed />;
    case "js-includes-some-every":
      return <JsIncludesSomeEveryEmbed />;
    case "js-reduce":
      return <JsReduceEmbed />;
    case "js-json-stringify":
      return <JsJsonStringifyEmbed />;
    case "js-house":
      return <JsHouseEmbed />;
    case "js-spreader":
      return <JsSpreaderEmbed />;
    case "js-destructing":
      return <JsDestructingEmbed />;
    case "js-function-destructing":
      return <JsFunctionDestructingEmbed />;
    case "js-destructing-imports":
      return <JsDestructingImportsEmbed />;
    case "js-optional-chaining":
      return <JsOptionalChainingEmbed />;
    case "js-classes":
      return <JsClassesEmbed />;
    case "js-styles":
      return <JsStylesEmbed />;
    case "js-client-component":
      return <JsClientComponentEmbed />;
    case "js-server-component":
      return <JsServerComponentEmbed />;
    case "js-add":
      return <JsAddEmbed />;
    case "js-square":
      return <JsSquareEmbed />;
    case "js-highlight":
      return <JsHighlightEmbed />;
    case "js-path-parameters":
      return <JsPathParametersEmbed />;
    case "js-todo-list":
      return <JsTodoListEmbed />;
    case "lab4-stub":
      return <Lab4StubEmbed />;
    case "click-event":
      return <ClickEventEmbed />;
    case "passing-data":
      return <PassingDataEmbed />;
    case "passing-functions":
      return <PassingFunctionsEmbed />;
    case "counter-broken":
      return <CounterBrokenEmbed />;
    case "counter":
      return <CounterEmbed />;
    case "boolean-state":
      return <BooleanStateEmbed />;
    case "string-state":
      return <StringStateEmbed />;
    case "date-state":
      return <DateStateEmbed />;
    case "object-state":
      return <ObjectStateEmbed />;
    case "array-state":
      return <ArrayStateEmbed />;
    case "parent-child-state":
      return <ParentChildStateEmbed />;
    case "prop-drilling":
      return <PropDrillingEmbed />;
    case "url-encoding":
      return <UrlEncodingEmbed />;
    case "context-counter":
      return <ContextCounterEmbed />;
    case "zustand-counter":
      return <ZustandCounterEmbed />;
    case "zustand-todos":
      return <ZustandTodosEmbed />;
    case "use-effect":
      return <UseEffectEmbed />;
    case "kambaz-courses-crud":
      return <KambazCoursesCrudEmbed />;
    case "lab5-env":
      return <Lab5EnvEmbed />;
    case "lab5-hello":
      return <Lab5HelloEmbed />;
    case "lab5-calculator":
      return <Lab5CalculatorEmbed />;
    case "lab6-status":
      return <Lab6StatusEmbed />;
    case "lab6-todos":
      return <Lab6TodosEmbed />;
    case "lab6-users":
      return <Lab6UsersEmbed />;
    case "youtube-search":
      return <YouTubeSearchEmbed />;
    case "youtube-details":
      return <YouTubeDetailsEmbed />;
    case "youtube-lesson":
      return <YouTubeLessonEmbed />;
    case "openai-chat":
      return <OpenAIChatEmbed />;
    case "openai-images":
      return <OpenAIImagesEmbed />;
    case "openai-vision":
      return <OpenAIVisionEmbed />;
    case "grok-sparkle":
      return <GrokSparkleEmbed />;
    case "grok-modules":
      return <GrokModulesEmbed />;
    default: {
      const _exhaustive: never = id;
      return _exhaustive;
    }
  }
}
