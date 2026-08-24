import {
  authorizeRuntimeGeneratedInteraction,
  type RuntimeAuthorizedGeneratedInteractionResult,
} from "./authority-gated-interaction.js";
import type {
  RuntimeAuthenticatedActorContext,
  RuntimeAuthorityModel,
} from "./authority-resolution.js";
import type { RuntimeGeneratedViewBinding } from "./generated-view-bindings.js";
import type { RuntimeGeneratedViewDocument } from "./generated-view-document.js";
import type { RuntimePermissionEvaluationContext } from "./permission-evaluation.js";

function bindingFromDocument(document: RuntimeGeneratedViewDocument): RuntimeGeneratedViewBinding {
  return Object.freeze({
    viewRef: document.viewRef,
    entityRef: document.entityRef,
    fields: Object.freeze(document.fields.map((field) => Object.freeze({
      fieldRef: field.fieldRef,
      type: field.type,
      required: field.required,
    }))),
    actions: Object.freeze(document.actions.map((action) => Object.freeze({ actionRef: action.actionRef }))),
  });
}

export function authorizeRuntimeRenderedGeneratedInteraction(input: Readonly<{
  document: RuntimeGeneratedViewDocument;
  actionRef: string;
  authorityModel: RuntimeAuthorityModel;
  actor: RuntimeAuthenticatedActorContext;
  context?: RuntimePermissionEvaluationContext;
}>): RuntimeAuthorizedGeneratedInteractionResult {
  return authorizeRuntimeGeneratedInteraction({
    binding: bindingFromDocument(input.document),
    actionRef: input.actionRef,
    authorityModel: input.authorityModel,
    actor: input.actor,
    ...(input.context === undefined ? {} : { context: input.context }),
  });
}
