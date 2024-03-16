import React, { useState } from 'react';
import axios from 'axios';
import { bytesToSize } from '../../utils/converter';
import FeedbackModal from '../../components/feedback-modal';

function UserCheckDocument() {
  const [files, setFiles] = useState([]); // lokal state untuk menyimpan file yang akan diupload
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // maxSize untuk maksimal yang bisa diupload. sekarang diset di 20mb
  const maxSize = 22000000;

  // buat variable global untuk menyimpan value localstorage is_review_app
  const isReviewApp = localStorage.getItem('is_review_app')
    ? JSON.parse(localStorage.getItem('is_review_app'))
    : null;

  // method changeFiles untuk memodifikasi file file yang akan diproses.
  // di method ini juga ada pengecekan validasinya
  const changeFiles = (e) => {
    if (e.target.files && e.target.files.length) {
      const modifikasiFileUpload = [];
      for (let i = 0; i < e.target.files.length; i++) {
        const { name, size } = e.target.files[i];
        let error = '';
        if (size > maxSize) {
          error = 'Ukuran file harus dibawah 20mb.';
        }
        modifikasiFileUpload.push({
          index: i,
          name,
          size,
          error,
          file_data: e.target.files[i],
          validity: '',
          result: {
            name: '',
            type: ''
          },
          object_url: '',
          is_processing: false
        });
      }
      setFiles(modifikasiFileUpload);
    }
  };

  // method ini dipasang di tombol Hapus pada masing masing file yang belum diproses
  const deleteFiles = (indexFile) => {
    const listFile = files.filter((val) => val.index !== indexFile);
    setFiles(listFile);
  };

  // method ini dipasang di tombol Reset Hasil untuk menghapus semua file yang udah diproses
  const resetResults = () => {
    if (isReviewApp && isReviewApp.value) {
      document.getElementById('checkDocumentUploader').value = '';
      setFiles([]);
    } else {
      // open modal
      setIsModalOpen(true);
    }
  };

  // method ini melakukan pemanggilan API Scan File untuk mendapatkan validitas dari file
  // yang di scan apakah sudah sesuai atau belum
  const callCheckingDocumentApi = async (file) => {
    try {
      const formData = new FormData();
      formData.append('files', file);
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/v1/services/filesignature/scanner`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'ngrok-skip-browser-warning': 'true'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error calling API`, error);
      throw error;
    }
  };

  // method ini menjalankan pengecekan pada semua files namun dilakukan secara satu persatu
  // dengan method bawaan dari javascript yaitu map
  const checkFiles = async () => {
    setLoading(true);
    try {
      await Promise.all(
        files.map(async (item) => {
          item.is_processing = true;
          const responseHasilHitEndpointCheckDocument =
            await callCheckingDocumentApi(item.file_data);
          const { data } = responseHasilHitEndpointCheckDocument;
          item.validity = data[0].validity;
          item.result = {
            name: `${item.name.split('.')[0]}.${
              data[0].metas[0].extensions[0] === 'jpg'
                ? 'jpeg'
                : data[0].metas[0].extensions[0]
            }`,
            type: data[0].metas[0].mime
          };
          item.is_processing = false;

          setFiles(files);
        })
      );
    } catch (error) {
      alert('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // method ini dipasang di tombol Download File / Download File Aslinya
  // untuk mendownload file yang telah di scan.
  const downloadFile = (file) => {
    if (isReviewApp && isReviewApp.value) {
      const blob = new Blob([file.file_data], { type: file.result.type });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.result.name;
      a.click();
    } else {
      // open modal
      setIsModalOpen(true);
    }
  };

  return (
    <div className="container">
      <h1>File Analyzer</h1>
      <div className="input-group mb-3">
        <input
          type="file"
          className="form-control"
          id="checkDocumentUploader"
          multiple
          onChange={(e) => changeFiles(e)}
        />
        <label className="input-group-text" htmlFor="checkDocumentUploader">
          Upload
        </label>
      </div>

      {files && files.length ? (
        <ol className="list-group">
          <li
            className="list-group-item list-group-item-light"
            aria-current="true"
          >
            Daftar Files
          </li>
          {files.map((file) => (
            <li key={file.index + 1} className="list-group-item">
              <div className="row mx-0">
                <div className="col-6">
                  <p>Nomor: {file.index + 1}</p>
                  <p>Nama file: {file.name}</p>
                  <p>Ukuran file: {bytesToSize(file.size, ' ')}</p>
                  {file.error && <p className="text-danger">{file.error}</p>}
                  {!file.result.name && (
                    <button
                      className="btn btn-danger mt-3"
                      onClick={() => deleteFiles(file.index)}
                      disabled={file.is_processing}
                    >
                      Hapus
                    </button>
                  )}
                </div>
                {file.result.name && (
                  <div className="col-6">
                    <div className="d-flex flex-column justify-content-end">
                      <p className="border-bottom">Hasil Pengecekan</p>
                      <p>
                       Validitas:{' '}
                        <span
                          className={`text-${
                            file.validity || file.result.name === file.name ? 'success' : 'danger'
                          }`}
                        >
                          {file.validity || file.result.name === file.name
                            ? 'Tipe file benar'
                            : 'Tipe file salah'}
                        </span>
                      </p>
                      <p>Nama Asli File: {file.result.name}</p>
                      <button
                        onClick={() => downloadFile(file)}
                        className="btn btn-outline-primary"
                      >
                        Unduh Berkas {!file.validity ? '' : ''}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </li>
          ))}
          <button
            disabled={
              files.some((val) => val.error !== '') ||
              loading ||
              files.some((val) => val.is_processing)
            }
            className="btn btn-primary mt-3"
            onClick={
              files.some((val) => val.result.name !== '')
                ? resetResults
                : checkFiles
            }
          >
            {loading
              ? 'Loading...'
              : `${
                  files.some((val) => val.result.name !== '')
                    ? 'Reset Hasil'
                    : 'Proses'
                }`}
          </button>
        </ol>
      ) : (
        <div />
      )}
      <FeedbackModal
        isModalOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
      />
    </div>
  );
}

export default UserCheckDocument;
