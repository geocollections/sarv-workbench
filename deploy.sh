bash server_dir_update.sh

  echo "-------------------------------"
echo "BUILDING: Building project..."
npm run build
echo "Done."

  echo "-------------------------------"
echo "MOVING: built files to server..."
scp -P 5522 -a dist/. deploy@193.40.102.19:/var/www/sarv-edit-dev
echo "All done."
