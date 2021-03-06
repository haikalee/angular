<?php
use Service\Db;
use Service\Landa;

function Validasi($data, $custom = array())
{
    $validasi = array(
        'nama' => 'required',
        'id_kategori' => 'required',
        'keterangan' => 'required',
        'deskripsi' => 'required',
        'tanggal' => 'required'
    );
    $cek = validate($data,$validasi,$custom);

    return $cek;
}




$app->get('/m_barang/index', function($request, $response){
    $params = $request->getParams();
    $db     = Db::db();

    $data = $db->select('m_barang.*,m_kategori.nama as kategori')
               ->from('m_barang')
               ->leftJoin('m_kategori', 'm_barang.id_kategori = m_kategori.id')
               ->where('m_barang.is_deleted','=',0)
               ->orderBy('m_barang.id DESC');

               if (isset($params['filter'])) {
                   $filter = (array) json_decode($params['filter']);
                   foreach ($filter as $key => $value) {
                       if ($key == 'nama') {
                           $data->where('m_barang.nama','LIKE',$value);
                       }
                   }
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

$app->post('/m_barang/save',function ($request, $response){
    $data = $request->getParams();
    $db   = Db::db();
    $landa= new Landa();

    $validasi = Validasi($data);
    // $tanggal = $data['tanggal'];
    // $tgl = [$tanggal["year"], $tanggal["month"], $tanggal["day"]];
    // $data['tanggal'] = join("-" ,$tgl);
    if ($validasi === true) {
      if (isset($data['tanggal'])) {
        $data['tanggal'] = $landa->arrayToDate($data['tanggal']);
      }
        try {
            if (isset($data['id'])) {
                $model = $db->update('m_barang', $data,['id'=> $data['id']]);

            }else{
                $model = $db->insert('m_barang', $data);
            }
            return successResponse($response,$data);
        } catch (Exception $e) {
            return unprocessResponse($response, ['Terjadi Masalah pada Server']);
        }
    }
    return unprocessResponse($response, $validasi);
});

$app->post('/m_barang/hapus',function($request, $response){
    $data  = $request->getParams();
    $db    = Db::db();
    $model = $db->update('m_barang',['is_deleted' => 1],['id' => $data['id']]);

    if (isset($model)) {
        return successResponse($response, [$model]);
    }
    return unprocessResponse($response,['terjadi masalah pada server']);
});
