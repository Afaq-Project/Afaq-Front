"use client";

import { useState } from "react";

import Modal from "@/src/shared/ui/Modal";
import Input from "@/src/shared/ui/Input";
import Textarea from "@/src/shared/ui/Textarea";
import Button from "@/src/shared/ui/Button";
import { ManagedOpportunity, ManagedOpportunityDraft } from "../types/opportunity";

function toDraft(opportunity: ManagedOpportunity): ManagedOpportunityDraft {
  return {
    title: opportunity.title,
    description: opportunity.description,
    eligibility: opportunity.eligibility,
    deadline: opportunity.deadline,
    provider: opportunity.provider,
    officialLink: opportunity.officialLink,
  };
}

function EditOpportunityForm({
  opportunity,
  onClose,
  onSave,
}: {
  opportunity: ManagedOpportunity;
  onClose: () => void;
  onSave: (id: string, draft: ManagedOpportunityDraft) => void;
}) {
  const [draft, setDraft] = useState<ManagedOpportunityDraft>(() => toDraft(opportunity));

  const isValid =
    draft.title.trim().length > 0 &&
    draft.provider.trim().length > 0 &&
    draft.deadline.trim().length > 0 &&
    draft.officialLink.trim().length > 0;

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!isValid) return;
    onSave(opportunity.id, draft);
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <Input
        id="edit-title"
        label="Title"
        value={draft.title}
        onChange={(event) => setDraft({ ...draft, title: event.target.value })}
      />

      <Input
        id="edit-provider"
        label="Provider"
        value={draft.provider}
        onChange={(event) => setDraft({ ...draft, provider: event.target.value })}
      />

      <Textarea
        id="edit-description"
        label="Description"
        value={draft.description}
        onChange={(event) => setDraft({ ...draft, description: event.target.value })}
      />

      <Textarea
        id="edit-eligibility"
        label="Eligibility criteria"
        value={draft.eligibility}
        onChange={(event) => setDraft({ ...draft, eligibility: event.target.value })}
      />

      <Input
        id="edit-deadline"
        type="date"
        label="Deadline"
        value={draft.deadline}
        onChange={(event) => setDraft({ ...draft, deadline: event.target.value })}
      />

      <Input
        id="edit-link"
        type="url"
        label="Official link"
        value={draft.officialLink}
        onChange={(event) => setDraft({ ...draft, officialLink: event.target.value })}
      />

      <div className="flex justify-end gap-2 mt-2">
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={!isValid}>
          Save changes
        </Button>
      </div>
    </form>
  );
}

export function EditOpportunityModal({
  opportunity,
  onClose,
  onSave,
}: {
  opportunity: ManagedOpportunity | null;
  onClose: () => void;
  onSave: (id: string, draft: ManagedOpportunityDraft) => void;
}) {
  return (
    <Modal open={Boolean(opportunity)} onClose={onClose} title="Edit opportunity">
      {opportunity && (
        <EditOpportunityForm
          key={opportunity.id}
          opportunity={opportunity}
          onClose={onClose}
          onSave={onSave}
        />
      )}
    </Modal>
  );
}
