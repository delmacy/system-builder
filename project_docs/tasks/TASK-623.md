# TASK-623 — Component Editor specialization adapter

Status: ready
Depends on: TASK-622
Milestone: M2

## Goal
Create the minimal Component Editor specialization adapter over the shared CompositionEditorEngine, translating reusable component descriptor/registry semantics into engine inputs without duplicating engine authority.

## Required
- reuse shared editor state, validation, selection, draft and preview semantics;
- expose only component-definition presentation/composition concerns;
- preserve stable semantic refs and deterministic failure;
- add focused regression tests for authority/dependency direction.

## Forbidden
AppManifest/Launcher; Window/View Editor; persistence/publish/deploy/provider runtime; Core/business authority; arbitrary pixel geometry; engine fork/reimplementation.

## Proof
Tests must demonstrate adapter delegation to shared engine and absence of AppManifest/WindowGeometry/Core ownership.

## max_files
8
