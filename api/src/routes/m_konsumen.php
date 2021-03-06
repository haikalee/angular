<?php 

use Service\Db;
use Service\Landa;

function Validasi($data, $custom = array()) {
    $validasi = array(
        'nama' => 'required', 
        'email' => 'required', 
        'no_hp' => 'required', 
        'alamat' => 'required', 
    );
    $cek = validate($data,$validasi,$custom);
    return $cek;
}
$app->get('/m_konsumen/index', function ($request, $response) {
  $params = $request->getParams();
  $db = Db::db();

  $data = $db ->select('*')
              ->from('m_konsumen')
              ->where('m_konsumen.is_deleted','=', 0)
              ->orderBy('m_konsumen.id DESC');
  
  if (isset($params['filter'])) {
    $filter = (array) json_decode($params['filter']);
    foreach($filter as $key => $value) {
      if ($key == 'nama') {
        $data->where('m_konsumen.nama', 'LIKE', $value);
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

$app->post('/m_konsumen/save', function($request, $response) {
  $data = $request->getParams();
  $db = Db::db();
  $landa = new Landa();

  $validasi = Validasi($data);
  if ($validasi === true) {
    if (isset($data['tanggal'])) {
      $data['tanggal'] = $landa->arrayToDate($data['tanggal']);
    }

    try {
      if (isset($data['id'])) {
        $model = $db->update('m_konsumen', $data, ['id' => $data['id']]);
      } else {
        $model = $db->insert('m_konsumen', $data);
      }

      return successResponse($response, $model);
    } catch (Exception $e) {
      return unprocessResponse($response, ['terjadi masalah pada server']);
    }
  }
  return unprocessResponse($response, $validasi);
});

$app->post('/m_konsumen/delete', function ( $request,  $response) {
  $data = $request->getParams();
  $db = Db::db();
  $model = $db->update('m_konsumen', ['is_deleted' => 1],['id' => $data['id']]);

  if (isset($model)) {
    return successResponse($response, [$model]);
  }
  return unprocessResponse($response, ['terjadi masalah pada server']);
});