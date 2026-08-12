# Dependency Layers

Dependencies are recorded at the lowest useful stable level. Capability-level edges explain architecture; WP-level edges control planning; task-level edges drive near-term scheduling.

A higher-level edge should be refined, not blindly copied to every child. Child tasks inherit only dependencies actually needed for their outputs.

This avoids over-serializing the project.
