/*
フォルダーID＝ xxxxxxxxxxxxの部分
https://drive.google.com/drive/folders/xxxxxxxxxxxxxx
*/
var DRIVE_FOLDER_ID = [['フォルダーID','フォルダ名'],['フォルダーID','フォルダ名']];

function updateCheck() {
  // 現在,昨日時刻を取得
  var today = new Date();
  var yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
  // 更新フォルダーリストを作成
  var updateFoldersList = [];
  for(var i = 0; i < DRIVE_FOLDER_ID.length; i++){
      var folder = DriveApp.getFolderById(DRIVE_FOLDER_ID[i][0]);
      var folders = folder.getFolders();
      // 最終更新日時を取得
      var lastUpdateFolderMap = {};
      var lastUpdateFoldersMap = {};
      while (folders.hasNext()) {
          var folder = folders.next();
          if(folder.getLastUpdated() > yesterday){
              lastUpdateFoldersMap[folder.getName()] = folder.getLastUpdated();
          }
      }
      lastUpdateFolderMap[DRIVE_FOLDER_ID[i][1]] = lastUpdateFoldersMap;
      updateFoldersList.push(lastUpdateFolderMap);
  }
  var body = '';
  for(var j = 0; j < updateFoldersList.length; j++){
     var fMap = updateFoldersList[j];
     for(var key in fMap){
         if(Object.keys(fMap[key]).length != 0){
             body += key;
             body += "\n";
             for(var item in fMap[key]){
                 body += item;
             }
             body += "\n";
         }
     }
  }
  if(body != ''){
      try{
          /* ユーザー宛送信 */
          // 送信先オプション
          var options = {};
          options.from = '送信元メールアドレス'
          // メール送信
          GmailApp.sendEmail('送信先メールアドレス', '件名', body, options);
      }catch(e){
          GmailApp.sendEmail(admin, "【失敗】Googleフォームからメール送信中にエラーが発生", e.message);
      }
  }
}
