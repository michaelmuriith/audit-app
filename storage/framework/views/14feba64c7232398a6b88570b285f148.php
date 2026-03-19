<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; font-size: 12px; }
        .header { text-align: center; font-weight: bold; margin-bottom: 20px; font-size: 14px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
        th, td { border: 1px solid #000; padding: 6px; text-align: left; }
        th { background-color: #f0f0f0; }
        .section-title { font-weight: bold; margin-top: 15px; margin-bottom: 5px; text-decoration: underline; }
        .no-border-table td, .no-border-table th { border: none; padding: 4px; }
        .agenda-list { margin-bottom: 15px; }
        .signatures { margin-top: 40px; }
        .signatures td { border: none; }
    </style>
</head>
<body>
    <div style="text-align: right; font-size: 10px; color: #0088cc; margin-bottom: 20px;">
        Public Sector Internal Audit Manual, Kenya
    </div>

    <div class="header">
        Minutes of <?php echo e($meeting->title); ?> held on 
        <?php echo e($meeting->start_time?->format('d M Y')); ?> at 
        <?php echo e($meeting->start_time?->format('H:i')); ?>

    </div>

    <div class="section-title">Present</div>
    <table class="no-border-table" style="width: 100%;">
        <tr>
            <th style="width: 30%">Name</th>
            <th style="width: 35%">Designation</th>
            <th style="width: 35%">Department</th>
        </tr>
        <?php $__empty_1 = true; $__currentLoopData = $meeting->attendees->where('rsvp_status', 'present'); $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $person): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); $__empty_1 = false; ?>
        <tr>
            <td><?php echo e($person->name ?? $person->user?->name ?? $person->email); ?></td>
            <td><?php echo e($person->designation ?? '-'); ?></td>
            <td><?php echo e($person->department ?? '-'); ?></td>
        </tr>
        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); if ($__empty_1): ?>
        <tr><td colspan="3">None recorded</td></tr>
        <?php endif; ?>
    </table>

    <div class="section-title">Apologies</div>
    <table class="no-border-table" style="width: 100%;">
        <tr>
            <th style="width: 30%">Name</th>
            <th style="width: 35%">Designation</th>
            <th style="width: 35%">Department</th>
        </tr>
        <?php $__empty_1 = true; $__currentLoopData = $meeting->attendees->where('rsvp_status', 'apologies'); $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $person): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); $__empty_1 = false; ?>
        <tr>
            <td><?php echo e($person->name ?? $person->user?->name ?? $person->email); ?></td>
            <td><?php echo e($person->designation ?? '-'); ?></td>
            <td><?php echo e($person->department ?? '-'); ?></td>
        </tr>
        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); if ($__empty_1): ?>
        <tr><td colspan="3">None recorded</td></tr>
        <?php endif; ?>
    </table>

    <div class="section-title">Agenda</div>
    <ol class="agenda-list">
        <?php $__currentLoopData = $content['discussions'] ?? []; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $discussion): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
            <li><?php echo e($discussion['title'] ?? ''); ?></li>
        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
    </ol>

    <table>
        <tr>
            <th style="width: 60%">Point of Discussion</th>
            <th style="width: 20%">Action By</th>
            <th style="width: 20%">Responsibility</th>
        </tr>
        <?php $__currentLoopData = $content['discussions'] ?? []; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $discussion): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
        <tr>
            <td style="background-color: #e6f2ff; font-weight: bold;" colspan="3">
                Min. <?php echo e($loop->iteration); ?> <?php echo e($discussion['title'] ?? ''); ?>

            </td>
        </tr>
        <tr>
            <td><?php echo nl2br(e($discussion['discussion'] ?? '')); ?></td>
            <td><?php echo e($discussion['action_by'] ?? ''); ?></td>
            <td><?php echo e($discussion['responsibility'] ?? ''); ?></td>
        </tr>
        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
    </table>

    <table class="signatures">
        <tr>
            <td style="width: 50%;">
                <strong>Prepared by (IA Team Leader)</strong><br><br>
                Name: ______________________<br><br>
                Date: ______________________
            </td>
            <td style="width: 50%;">
                <strong>Acknowledged by (Audit Client)</strong><br><br>
                Name: ______________________<br><br>
                Date: ______________________
            </td>
        </tr>
    </table>
</body>
</html>
<?php /**PATH /home/miko/projects/audit-app/resources/views/pdf/entrance-minutes.blade.php ENDPATH**/ ?>