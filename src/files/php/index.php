<?php

	$action = $_POST['action'];

	switch ($action) {
		case 'create':
			create();
			break;
		default:
			create();
			break;
	}

	/* =======================================================================
		Create
	========================================================================== */
	function create() {

		$parent = $_POST['parent'];
		$child  = $_POST['child'];
		$child  = explode(',',$child);
		$dir_download   = './download/';
		$directory_path = $dir_download.$parent;

		deleteFolderData($dir_download);

		if ( mkdir($directory_path, 0777) ) {

			chmod($directory_path, 0777);
			writeWebloc($directory_path);
			setZip($directory_path,$child);

		} else {

			echo "作成に失敗しました";

		}
	}

	/* =======================================================================
		Set Zip
	========================================================================== */
	function setZip($dir,$child) {

		$zip = new ZipArchive();
		if ($zip->open($dir.'.zip', ZipArchive::CREATE) === true) {

			$length = count($child);
			for ($i = 0; $i < $length; $i++) {

				$zip->addEmptyDir($child[$i]);
				echo $child[$i];

			}

			$zip->addFile($dir.'/link.webloc',$_POST['title'].'.webloc');

			$zip->close();
			exit();

		} else {

			exit('open error.');

		}
	}

	/* =======================================================================
		Write
	========================================================================== */
	function writeWebloc($directory_path) {

		$file = $directory_path.'/link.webloc';
		touch($file);

		$location = $_POST['location'];
		$location = str_replace('&','&amp;',$location);
		$add  = 
			'<?xml version="1.0" encoding="UTF-8"?>
				<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
				<plist version="1.0">
					<dict>
						<key>URL</key>
						<string>'.$location.'</string>
					</dict>
				</plist>';
		file_put_contents($file,$add);

	}

	/* =======================================================================
		Download
	========================================================================== */
	function download() {

		$f_location = $dir.'.zip';
		$f_name = 'download.zip';
		header('Content-Description: File Transfer');
		header('Content-Type: application/octet-stream');
		header('Content-Length: ' . filesize($f_location));
		header('Content-Disposition: attachment; filename=' . basename($f_name));
		readfile($f_location);

	}

	/* =======================================================================
		Delete
	========================================================================== */
	function deleteFile() {

		$target = $_POST['target'];
		$path   = './download/'.$target;

		unlink($path.'/'.'link.webloc');
		rmdir($path);

		$zip = new ZipArchive();
		$zip->open($path.'.zip');
		$zip->close();
		unlink($path.'.zip');

	}

	/* =======================================================================
		Delete Folder Data
	========================================================================== */
	function deleteFolderData($dir) {

		if ( $dirHandle = opendir($dir)) {
			while ( false !== ( $fileName = readdir($dirHandle) ) ) {

				$path = $dir.$fileName;
				if ($fileName != "." && $fileName != "..") {
					unlink($path);
					if(strpos($fileName,'.') === false){
						unlink($path.'/'.'link.webloc');
						rmdir($path);
					}
				}
				
			}
			closedir($dirHandle);
		}

	}

?>