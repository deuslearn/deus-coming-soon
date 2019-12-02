#!/bin/sh

mkdir $HOME/.deus
echo "$DEUS_KEY"

# --batch to prevent interactive command --yes to assume "yes" for questions
gpg --quiet --batch --yes --decrypt --passphrase "$DEUS_KEY" \
--output .github/deploy/app.yml .github/deploy/app.yml.gpg