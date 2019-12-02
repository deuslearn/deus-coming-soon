#!/bin/sh

mkdir $HOME/.deus
echo "$DEUS_KEY"

# --batch to prevent interactive command --yes to assume "yes" for questions
gpg --quiet --batch --yes --decrypt --passphrase "$DEUS_KEY" \
--output app.yml app.yml.gpg