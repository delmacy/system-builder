# Escopo — Scheduler / Time

## Inclui
Instants/timezones, calendars, working periods, holidays, schedules, recurrence, timers, deadlines, expiration e SLA clock semantics.

## Não inclui
Assumir calendário/feriado universal ou misturar scheduling com job implementation.

## Entradas
Time definitions, calendars, recurrence/deadline rules e timezone context.

## Saídas
Resolved schedules/deadlines/timer events e temporal calculations.

## Critério de conclusão
Resultados temporais são reproduzíveis com timezone/calendar/version explícitos.