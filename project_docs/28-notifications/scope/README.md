# Escopo — Notifications

## Inclui
Notification intent, recipient resolution, templates, channels, provider adapters, delivery/retry/status, preferences e correlation.

## Não inclui
Colocar regra de negócio dentro do template ou exigir canal específico como core.

## Entradas
Notification request, recipient/context, template e provider configuration.

## Saídas
Delivery attempts/status/events e rendered content conforme policy.

## Critério de conclusão
O processo expressa “avisar X”; channels/providers podem variar sem mudar a Recipe.