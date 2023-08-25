const access = (role) => {
    return (request, response, next) => {
      const userRole = request.user.role; // Mendapatkan peran pengguna dari data otentikasi (contoh: admin, kasir, manajer)
  
      if (role.includes(userRole)) {
        // Jika peran pengguna termasuk dalam peran yang diizinkan
        next(); // Melanjutkan ke middleware atau penanganan permintaan berikutnya
      } else {
        response.status(403).json({
          status: "error",
          message: "Tidak diizinkan untuk mengakses sumber daya ini"
        });
      }
    };
  };

module.exports = access