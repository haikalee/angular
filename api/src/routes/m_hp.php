<?php
use Service\Db;
use Service\Landa;

function Validasi($data, $custom = array())
{
    $validasi = array(
        'nama' => 'required',
        'id_merek' => 'required',
        'prosessor' => 'required',
        'stok' => 'required',
        'harga_beli' => 'required',
        'harga_jual' => 'required',
        'daya_baterai' => 'required',
        'rom' => 'required',
        'ram' => 'required',
        'id_supplier' => 'required',
    );
    $cek = validate($data,$validasi,$custom);

    return $cek;
}




$app->get('/m_hp/index', function($request, $response){
    $params = $request->getParams();
    $db     = Db::db();

    $data = $db->select('m_hp.*,m_merek.nama as merek,m_supplier.nama as supplier')
               ->from('m_hp')
               ->join('JOIN', 'm_merek', 'm_hp.id_merek = m_merek.id')
               ->join('JOIN', 'm_supplier', 'm_hp.id_supplier = m_supplier.id')
               ->where('m_hp.is_deleted','=',0)
               ->orderBy('m_hp.id DESC');
                // ej(json_decode($params['filter']));
               if (isset($params['filter'])) {
                   $filter = (array) json_decode($params['filter']);
                   foreach ($filter as $key => $value) {
                      if ($key == 'nama') { 
                        $data->where('m_hp.nama', "LIKE",$value);
                      } else if ($key == 'prosessor') {
                        $data->where('m_hp.prosessor', "LIKE",$value);
                      } else if ($key == 'merek') {
                        if ($value) {
                          $data->where('m_hp.id_merek', "like", (string) $value->id);
                        }
                      }
                    }
                    // die;
               }
               if (isset($params['limit']) && !empty($params['llimit'])) {
                   $data->limit($params['limit']);
               }
               if (isset($params['offset']) && !empty($params['offset'])) {
                   $data->offset($params['offset']);
               }

               $models     = $data->findAll();
               $totalItems = $data->count(); 

               return successResponse($response, [
                   'list'=> $models,
                   'totalItems' => $totalItems
               ]);

});

$app->post('/m_hp/save',function ($request, $response){
    $data = $request->getParams();
    $db   = Db::db();
    $landa= new Landa();

    $validasi = Validasi($data);
    // ej($validasi);
    if ($validasi === true) {
      // ej($data);
      $data['id_merek'] = $data['id_merek']['id'];
      $data['id_supplier'] = $data['id_supplier']['id'];
      if (isset($data['tanggal'])) {
        $data['tanggal'] = $landa->arrayToDate($data['tanggal']);
      }
        try {
            if (isset($data['id'])) {
                $model = $db->update('m_hp', $data,['id'=> $data['id']]);

            }else{
                $model = $db->insert('m_hp', $data);
            }
            return successResponse($response,$model);
        } catch (Exception $e) {
            return unprocessResponse($response, ['Terjadi Masalah pada Server']);
        }
    }
    return unprocessResponse($response, $validasi);
});

$app->post('/m_hp/delete',function($request, $response){
    $data  = $request->getParams();
    $db    = Db::db();
    $model = $db->update('m_hp',['is_deleted' => 1],['id' => $data['id']]);

    if (isset($model)) {
        return successResponse($response, [$model]);
    }
    return unprocessResponse($response,['terjadi masalah pada server']);
});

$app->get('/m_hp/merek',function($request,$response){
  $params = $request->getParams();
  $db     = Db::db();

  $data = $db->select('m_merek.id,m_merek.nama')
              ->from('m_merek')
              ->where('m_merek.is_deleted','=',0);

    $model = $data->findAll();
    return successResponse($response, [
      'list' => $model
    ]);
});

$app->get('/m_hp/supplier',function($request,$response){
  $params = $request->getParams();
  $db     = Db::db();

  $data = $db->select('m_supplier.id,m_supplier.nama')
              ->from('m_supplier')
              ->where('m_supplier.is_deleted','=',0)
              ->findAll();
  // ej($data);
      return successResponse($response,$data);
});
