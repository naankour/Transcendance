#!/bin/sh
# Applique les migrations Prisma. Sur une base neuve (créée par init.sql,
# donc "non vide" aux yeux de Prisma), on résout d'abord la baseline
# avant de réessayer, sans intervention manuelle.

set -e

if npx prisma migrate deploy; then
  echo "Migrations appliquées avec succès."
else
  echo "Deploy initial échoué (base probablement neuve) — résolution de la baseline..."
  npx prisma migrate resolve --applied 0_baseline
  npx prisma migrate deploy
fi