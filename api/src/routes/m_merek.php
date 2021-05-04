<?php 

use Service\Db;
use Service\Landa;

function Validasi($data, $custom = array()) {
  $validasi = array(
    'nama' => 'required',
  );

  $cek = validate($data, $validasi, $custom);
  return $cek;
}

$app->get('/m_merek/index', function($request, $response) {
  $params = $request->getparams();
  $db = Db::db();

  $data = $db ->select('*')
              ->from('m_merek')
              ->where('m_merek.is_deleted','=', 0)
              ->orderBy('m_merek.id DESC');

  if (isset($params['filter'])) {
    $filter = (array) json_decode($params['filter']);
    foreach($filter as $key => $value) {
      if ($key == 'nama') {
        $data->where('m_merek.nama', 'LIKE', $value);
      }
    }
  }

  if (isset($params['limit']) && !empty($params['llimit'])) {
    $data->limit($params['limit']);
  }
  if (isset($params['offset']) && !empty($params['offset'])) {
      $data->offset($params['offset']);
  }

  $models = $data->findAll();
  $totalItems = $data->count();

  return successResponse($response, [
    'list' => $models,
    'totalItems' => $totalItems  
  ]);
});

$app->post('/m_merek/save', function ($request, $response) {
  $data = $request->getParams();
  $db = Db::db();
  $landa = new Landa();

  $validasi = Validasi($data);
  if ($validasi === true) {
    if (isset($data['tanggal'])) {
      $data['tanggal'] = $landa->arrayToDate($data['array']);
    }

    try {
      if (isset($data['id'])) {
        $model = $db->update('m_merek', $data, ['id' => $data['id']]);
      } else {
        $model = $db->insert('m_merek', $data);
      }

      return successResponse($response, $model);
    } catch (Exception $e) {
      return unprocessResponse($response, ['Terjadi Masalah pada Server']);
    }
  }
});

$app->post('/m_merek/delete',function($request, $response){
  $data  = $request->getParams();
  $db    = Db::db();
  $model = $db->update('m_merek',['is_deleted' => 1],['id' => $data['id']]);

  if (isset($model)) {
      return successResponse($response, [$model]);
  }
  return unprocessResponse($response,['terjadi masalah pada server']);
});