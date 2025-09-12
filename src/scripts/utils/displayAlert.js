import Swal from 'sweetalert2';
import "../../styles/Utils/Alert.css";

export function showErrorPopup(text) {
  Swal.fire({
    title: 'Error',
    text: text,
    icon: 'error',
    confirmButtonText: 'Close',

    // 🌙 Dark mode customizations
    background: '#1e1e1e',      // Popup background (dark gray)
    color: '#f1f1f1',            // Text color (light)
    iconColor: '#ff4d4d',        // Custom red for error icon

    // Custom button style
    customClass: {
      confirmButton: 'swal-confirm-button'
    }
  });
}
