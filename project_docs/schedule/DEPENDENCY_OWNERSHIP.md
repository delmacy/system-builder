# Dependency Ownership

Producer WP owns the authoritative output/contract it promises. Consumer WP owns declaring which producer output it requires. Planning validation reconciles both sides.

A dependency is considered specified only when producer output, consumer need, edge type and verification gate are named.

This prevents vague statements such as 'Auth depends on Users'. Prefer: 'Authentication DATA_REQUIRES SubjectIdentity schema vX and CONTRACT_REQUIRES SubjectRepository interface vY'.
