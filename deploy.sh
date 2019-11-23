#!/bin/bash

workdir=`echo $PWD`
enc_file="$workdir/deus_app.gpg"
dec_file="$workdir/deus_app.yml"
 
if [ ! -f `echo $enc_file` ]
then
 exit 1
fi
 
secret_file=`echo ~/.deus/secretKey`

delete_yml(){
    rm -rf $dec_file
}

exit_script() {
    delete_yml
    trap - SIGINT SIGTERM # clear the trap
    kill -- -$$ # Sends SIGTERM to child/sub processes
}

trap exit_script SIGINT SIGTERM

deploy_script=`gpg --batch --no-tty --passphrase-file $secret_file --decrypt $enc_file`
echo "$deploy_script" > $dec_file
gcloud app deploy $dec_file

# gpg --batch --yes --no-tty --output $enc_file --passphrase-file $secret_file -c $dec_file
delete_yml
rm -rf $dec_file