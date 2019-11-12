currentDate=$(date +"%Y-%m-%d")

ssh -p 5522 deploy@193.40.102.19 << EOF
cd /var/www/sarv-edit-dev/ || exit

if [ -d $currentDate/ ]; then
  echo "-------------------------------"
  echo "REMOVING: '$currentDate' directory"
  rm -r "$currentDate"/
  echo "Done."
fi

echo "---------------------------------"
echo "MAKING: new '$currentDate' directory"
mkdir "$currentDate"
echo "Done."

if [ -d js/ ]; then
  echo "-------------------------------"
  echo "MOVING: current build to '$currentDate' directory..."
  mv css/ favicon.ico fonts/ img/ index.html js/ "$currentDate"/
  echo "Done."
fi
EOF
