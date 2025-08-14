document.addEventListener('DOMContentLoaded', function () {
  var addForm = document.getElementById('addVehicleForm');
  var editForm = document.getElementById('editVehicleForm');
  var table = document.getElementById('vehicleTable');

  async function postForm(form, url, method) {
    const formData = new FormData(form);
    if (method && method.toUpperCase() !== 'POST') formData.append('_method', method.toUpperCase());
    const csrf = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'X-Requested-With': 'XMLHttpRequest', 'X-CSRF-TOKEN': csrf },
      body: formData
    });
    if (!resp.ok) throw new Error(await resp.text());
    return resp;
  }

  if (addForm) {
    addForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      try {
        await postForm(addForm, addForm.getAttribute('action') || '/vehicle-management', 'POST');
        var modalEl = document.getElementById('add-vehicle-modal');
        if (modalEl) modalEl.dispatchEvent(new CustomEvent('modal-hide'));
        if (typeof window.showNotification_users_toast_success === 'function') window.showNotification_users_toast_success();
        setTimeout(function(){ window.location.reload(); }, 600);
      } catch (err) {
        console.error(err);
        var slot = document.getElementById('users-error-message-slot');
        if (slot) slot.textContent = 'Failed to save vehicle';
        if (typeof window.showNotification_users_toast_error === 'function') window.showNotification_users_toast_error();
      }
    });
  }

  // Bind type-of-vehicle radio to hidden inputs (Add)
  function bindTypeRadios(groupName, hiddenId, otherWrapId, otherInputId) {
    var radios = document.querySelectorAll('input[name="'+groupName+'"]');
    var hidden = document.getElementById(hiddenId);
    var otherWrap = document.getElementById(otherWrapId);
    var otherInput = document.getElementById(otherInputId);
    if (!radios.length || !hidden) return;
    var update = function (val) {
      if (val === 'others') {
        if (otherWrap) otherWrap.classList.remove('hidden');
        if (otherInput) { otherInput.addEventListener('input', function(){ hidden.value = otherInput.value; }); hidden.value = otherInput.value || ''; }
      } else {
        if (otherWrap) otherWrap.classList.add('hidden');
        hidden.value = val;
      }
    };
    radios.forEach(function(r){
      r.addEventListener('change', function(){ update(this.value); });
      if (r.checked) update(r.value);
    });
  }

  bindTypeRadios('add_type_of_vehicle_opt','add_type_of_vehicle','add_other_type_wrap','add_other_type');

  // Owner type toggle (Add modal)
  (function(){
    var radios = document.querySelectorAll('input[name="add_owner_type"]');
    var homeownerWrap = document.getElementById('add_homeowner_wrap');
    var nonHomeWrap = document.getElementById('add_non_homeowner_wrap');
    var nhSurname = document.getElementById('add_nh_surname');
    var nhFirstname = document.getElementById('add_nh_firstname');
    var nhMiddlename = document.getElementById('add_nh_middlename');
    var nhHidden = document.getElementById('add_non_homeowners');
    var userSelect = document.getElementById('add_user_id');
    if (!radios.length) return;

    function applyState(val){
      var isNH = (val === 'non_homeowner');
      if (homeownerWrap) homeownerWrap.classList.toggle('hidden', isNH);
      if (nonHomeWrap) nonHomeWrap.classList.toggle('hidden', !isNH);
      if (userSelect) userSelect.required = !isNH;
      if (nhSurname) nhSurname.required = isNH;
      if (nhFirstname) nhFirstname.required = isNH;
      // build hidden combined value
      function updateHidden(){
        if (!nhHidden) return;
        var parts = [];
        if (nhSurname && nhSurname.value) parts.push(nhSurname.value);
        if (nhFirstname && nhFirstname.value) parts.push(nhFirstname.value);
        if (nhMiddlename && nhMiddlename.value) parts.push(nhMiddlename.value);
        nhHidden.value = parts.join(', ');
      }
      if (isNH) {
        [nhSurname, nhFirstname, nhMiddlename].forEach(function(el){ if (el) el.addEventListener('input', updateHidden); });
        updateHidden();
      } else {
        if (nhHidden) nhHidden.value = '';
        [nhSurname, nhFirstname, nhMiddlename].forEach(function(el){ if (el) el && (el.value = ''); });
      }
    }

    radios.forEach(function(r){
      r.addEventListener('change', function(){ applyState(this.value); });
      if (r.checked) applyState(r.value);
    });
  })();

  // Repeater for details
  var addDetailBtn = document.getElementById('addDetailRow');
  if (addDetailBtn) {
    addDetailBtn.addEventListener('click', function () {
      var container = document.getElementById('vehicleDetailsRepeater');
      if (!container) return;
      var groups = container.getElementsByClassName('vehicle-detail-group');
      var last = groups[groups.length - 1];
      var clone = last.cloneNode(true);
      // clear inputs
      Array.from(clone.querySelectorAll('input')).forEach(function (inp) { inp.value = ''; });
      // show remove button
      var rm = clone.querySelector('.remove-detail');
      if (rm) rm.classList.remove('hidden');
      container.appendChild(clone);
    });
  }

  document.addEventListener('click', function (e) {
    var rmBtn = e.target.closest('.remove-detail');
    if (!rmBtn) return;
    var group = rmBtn.closest('.vehicle-detail-group');
    if (!group) return;
    var container = document.getElementById('vehicleDetailsRepeater');
    if (!container) return;
    // keep at least one group
    if (container.getElementsByClassName('vehicle-detail-group').length > 1) {
      container.removeChild(group);
    }
  });

  if (table) {
    table.addEventListener('click', async function (e) {
      var editBtn = e.target.closest('a[data-action="edit"]');
      var deleteBtn = e.target.closest('a[data-action="delete"]');
      var viewBtn = e.target.closest('a[data-action="view"]');
      if (!editBtn && !deleteBtn && !viewBtn) return;
      e.preventDefault();
      var id = (editBtn || deleteBtn || viewBtn).getAttribute('data-id');
      if (!id) return;

      if (deleteBtn) {
        document.getElementById('deleteVehicleId').value = id;
        return;
      }

      if (viewBtn) {
        try {
          const resp = await fetch('/vehicle-management/' + id);
          if (!resp.ok) throw new Error(await resp.text());
          const data = await resp.json();
          const v = data.vehicle || {};
          const details = Array.isArray(data.details) ? data.details : [];
          var ownerName = (v.user && v.user.name) ? v.user.name : '';
          var setText = function (id, value) { var el = document.getElementById(id); if (el) el.textContent = value || ''; };
          setText('view_type_of_vehicle_text', v.type_of_vehicle);
          setText('view_owner_name_text', ownerName);
          setText('view_emergency_name_text', v.incase_of_emergency_name);
          setText('view_emergency_number_text', v.incase_of_emergency_number);
          setText('view_status_text', v.status);
          var tbody = document.getElementById('viewDetailsTableBody');
          if (tbody) {
            tbody.innerHTML = '';
            details.forEach(function (d) {
              var tr = document.createElement('tr');
              tr.innerHTML = '<td>'+(d.plate_number||'')+'</td>'+
                             '<td>'+(d.or_number||'')+'</td>'+
                             '<td>'+(d.cr_number||'')+'</td>'+
                             '<td>'+(d.vehicle_model||'')+'</td>'+
                             '<td>'+(d.color||'')+'</td>'+
                             '<td>'+(d.sticker_control_number||'')+'</td>';
              tbody.appendChild(tr);
            });
          }
          // ensure modal is shown in case the theme expects manual trigger
          var viewModal = document.getElementById('view-vehicle-modal');
          if (viewModal) viewModal.dispatchEvent(new CustomEvent('modal-show'));
        } catch (err) {
          console.error(err);
          var slot = document.getElementById('users-error-message-slot');
          if (slot) slot.textContent = 'Failed to load vehicle';
          if (typeof window.showNotification_users_toast_error === 'function') window.showNotification_users_toast_error();
        }
        return;
      }

      if (editBtn) {
        try {
          const resp = await fetch('/vehicle-management/' + id);
          if (!resp.ok) throw new Error(await resp.text());
          const data = await resp.json();
          const v = data.vehicle || {};
          const details = Array.isArray(data.details) ? data.details : [];
          var setVal = function (id, value) { var el = document.getElementById(id); if (el) el.value = value || ''; };
          setVal('editVehicleId', v.id);
          setVal('edit_type_of_vehicle', v.type_of_vehicle);
          // set radio group for edit by value
          var editRadios = document.querySelectorAll('input[name="edit_type_of_vehicle_opt"]');
          editRadios.forEach(function(r){ r.checked = (r.value === v.type_of_vehicle); });
          // handle others
          if ([].every ? [].every.call(editRadios, function(r){ return r.value !== v.type_of_vehicle; }) : true) {
            // if value not in preset, select others and show input
            editRadios.forEach(function(r){ if (r.value === 'others') r.checked = true; });
            var wrap = document.getElementById('edit_other_type_wrap');
            if (wrap) wrap.classList.remove('hidden');
            var other = document.getElementById('edit_other_type');
            if (other) other.value = v.type_of_vehicle || '';
          }
          setVal('edit_user_id', v.user_id);
          setVal('edit_incase_of_emergency_name', v.incase_of_emergency_name);
          setVal('edit_incase_of_emergency_number', v.incase_of_emergency_number);
          setVal('edit_status', v.status || 'active');

          // Owner type (edit)
          var editOwnerRadios = document.querySelectorAll('input[name="edit_owner_type"]');
          var editHomeWrap = document.getElementById('edit_homeowner_wrap');
          var editNonWrap = document.getElementById('edit_non_homeowner_wrap');
          var nhSurname = document.getElementById('edit_nh_surname');
          var nhFirstname = document.getElementById('edit_nh_firstname');
          var nhMiddlename = document.getElementById('edit_nh_middlename');
          var nhHidden = document.getElementById('edit_non_homeowners');
          function setNHHidden(){
            if (!nhHidden) return;
            var parts = [];
            if (nhSurname && nhSurname.value) parts.push(nhSurname.value);
            if (nhFirstname && nhFirstname.value) parts.push(nhFirstname.value);
            if (nhMiddlename && nhMiddlename.value) parts.push(nhMiddlename.value);
            nhHidden.value = parts.join(', ');
          }
          var useNonHomeowner = !!v.non_homeowners && !v.user_id;
          editOwnerRadios.forEach(function(r){ r.checked = (r.value === (useNonHomeowner ? 'non_homeowner' : 'homeowner')); });
          if (editHomeWrap) editHomeWrap.classList.toggle('hidden', useNonHomeowner);
          if (editNonWrap) editNonWrap.classList.toggle('hidden', !useNonHomeowner);
          if (useNonHomeowner) {
            var parts = (v.non_homeowners || '').split(',').map(function(s){return s.trim();});
            if (nhSurname) nhSurname.value = parts[0] || '';
            if (nhFirstname) nhFirstname.value = parts[1] || '';
            if (nhMiddlename) nhMiddlename.value = parts[2] || '';
            setNHHidden();
          } else {
            if (nhSurname) nhSurname.value = '';
            if (nhFirstname) nhFirstname.value = '';
            if (nhMiddlename) nhMiddlename.value = '';
            if (nhHidden) nhHidden.value = '';
          }

          // populate details repeater
          var container = document.getElementById('editVehicleDetailsRepeater');
          if (container) {
            // remove all groups except the first template
            var groups = container.getElementsByClassName('vehicle-detail-group');
            // reset to a single template group
            while (groups.length > 1) {
              container.removeChild(groups[groups.length - 1]);
            }
            var template = groups[0];
            // clear template inputs
            Array.from(template.querySelectorAll('input')).forEach(function (inp) { inp.value = ''; });
            template.querySelector('.remove-detail')?.classList.add('hidden');

            if (details.length === 0) {
              return;
            }
            // fill first using template
            var first = details[0] || {};
            var tinputs = template.querySelectorAll('input');
            template.querySelector('input[name="plate_number[]"]').value = first.plate_number || '';
            template.querySelector('input[name="or_number[]"]').value = first.or_number || '';
            template.querySelector('input[name="cr_number[]"]').value = first.cr_number || '';
            template.querySelector('input[name="vehicle_model[]"]').value = first.vehicle_model || '';
            template.querySelector('input[name="color[]"]').value = first.color || '';
            template.querySelector('input[name="sticker_control_number[]"]').value = first.sticker_control_number || '';

            for (var i = 1; i < details.length; i++) {
              var row = details[i] || {};
              var clone = template.cloneNode(true);
              clone.querySelector('input[name="plate_number[]"]').value = row.plate_number || '';
              clone.querySelector('input[name="or_number[]"]').value = row.or_number || '';
              clone.querySelector('input[name="cr_number[]"]').value = row.cr_number || '';
              clone.querySelector('input[name="vehicle_model[]"]').value = row.vehicle_model || '';
              clone.querySelector('input[name="color[]"]').value = row.color || '';
              clone.querySelector('input[name="sticker_control_number[]"]').value = row.sticker_control_number || '';
              var rm = clone.querySelector('.remove-detail');
              if (rm) rm.classList.remove('hidden');
              container.appendChild(clone);
            }
          }
        } catch (err) {
          console.error(err);
          var slot = document.getElementById('users-error-message-slot');
          if (slot) slot.textContent = 'Failed to load vehicle';
          if (typeof window.showNotification_users_toast_error === 'function') window.showNotification_users_toast_error();
        }
      }
    });
  }

  var confirmDelete = document.getElementById('confirmDeleteVehicle');
  if (confirmDelete) {
    confirmDelete.addEventListener('click', async function () {
      var id = document.getElementById('deleteVehicleId').value;
      if (!id) return;
      try {
        const csrf = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        const resp = await fetch('/vehicle-management/' + id, {
          method: 'DELETE',
          headers: { 'X-Requested-With': 'XMLHttpRequest', 'X-CSRF-TOKEN': csrf }
        });
        if (!resp.ok) throw new Error(await resp.text());
        if (typeof window.showNotification_users_toast_success === 'function') window.showNotification_users_toast_success();
        setTimeout(function(){ window.location.reload(); }, 500);
      } catch (err) {
        console.error(err);
        var slot = document.getElementById('users-error-message-slot');
        if (slot) slot.textContent = 'Failed to delete vehicle';
        if (typeof window.showNotification_users_toast_error === 'function') window.showNotification_users_toast_error();
      }
    });
  }

  if (editForm) {
    editForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      const id = document.getElementById('editVehicleId').value;
      try {
        await postForm(editForm, '/vehicle-management/' + id, 'PUT');
        if (typeof window.showNotification_users_toast_success === 'function') window.showNotification_users_toast_success();
        setTimeout(function(){ window.location.reload(); }, 600);
      } catch (err) {
        console.error(err);
        var slot = document.getElementById('users-error-message-slot');
        if (slot) slot.textContent = 'Failed to update vehicle';
        if (typeof window.showNotification_users_toast_error === 'function') window.showNotification_users_toast_error();
      }
    });
  }

  // Edit repeater add/remove
  var editAddDetailBtn = document.getElementById('editAddDetailRow');
  if (editAddDetailBtn) {
    editAddDetailBtn.addEventListener('click', function () {
      var container = document.getElementById('editVehicleDetailsRepeater');
      if (!container) return;
      var groups = container.getElementsByClassName('vehicle-detail-group');
      var last = groups[groups.length - 1];
      var clone = last.cloneNode(true);
      Array.from(clone.querySelectorAll('input')).forEach(function (inp) { inp.value = ''; });
      clone.querySelector('.remove-detail')?.classList.remove('hidden');
      container.appendChild(clone);
    });
  }

  document.addEventListener('click', function (e) {
    var rmBtn = e.target.closest('#editVehicleDetailsRepeater .remove-detail');
    if (!rmBtn) return;
    var group = rmBtn.closest('.vehicle-detail-group');
    var container = document.getElementById('editVehicleDetailsRepeater');
    if (container && container.getElementsByClassName('vehicle-detail-group').length > 1) {
      container.removeChild(group);
    }
  });

  // Owner type toggle in Edit modal (user switch manual when editing)
  (function(){
    var radios = document.querySelectorAll('input[name="edit_owner_type"]');
    var homeWrap = document.getElementById('edit_homeowner_wrap');
    var nhWrap = document.getElementById('edit_non_homeowner_wrap');
    var nhSurname = document.getElementById('edit_nh_surname');
    var nhFirstname = document.getElementById('edit_nh_firstname');
    var nhMiddlename = document.getElementById('edit_nh_middlename');
    var nhHidden = document.getElementById('edit_non_homeowners');
    var userSelect = document.getElementById('edit_user_id');
    if (!radios.length) return;
    function updateHidden(){
      if (!nhHidden) return;
      var parts = [];
      if (nhSurname && nhSurname.value) parts.push(nhSurname.value);
      if (nhFirstname && nhFirstname.value) parts.push(nhFirstname.value);
      if (nhMiddlename && nhMiddlename.value) parts.push(nhMiddlename.value);
      nhHidden.value = parts.join(', ');
    }
    function apply(val){
      var isNH = (val === 'non_homeowner');
      if (homeWrap) homeWrap.classList.toggle('hidden', isNH);
      if (nhWrap) nhWrap.classList.toggle('hidden', !isNH);
      if (userSelect) userSelect.required = !isNH;
      if (nhSurname) nhSurname.required = isNH;
      if (nhFirstname) nhFirstname.required = isNH;
      updateHidden();
    }
    radios.forEach(function(r){ r.addEventListener('change', function(){ apply(this.value); }); });
  })();
});


