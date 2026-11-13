<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('contracts', function (Blueprint $table) {
            $table->foreignId('viewing_request_id')->nullable()->after('tenant_id')->constrained('viewing_requests')->nullOnDelete();
            $table->foreignId('lawyer_inquiry_id')->nullable()->after('viewing_request_id')->constrained('lawyer_inquiries')->nullOnDelete();
            $table->timestamp('owner_signed_at')->nullable()->after('current_version');
            $table->timestamp('tenant_signed_at')->nullable()->after('owner_signed_at');
            $table->timestamp('activated_at')->nullable()->after('tenant_signed_at');
            $table->text('termination_reason')->nullable()->after('activated_at');
            $table->string('status', 30)->default('draft')->change();
        });

        Schema::table('contract_versions', function (Blueprint $table) {
            $table->unsignedTinyInteger('advance_payment_months')->default(1)->after('deposit_amount');
            $table->unsignedTinyInteger('rent_due_day')->default(5)->after('advance_payment_months');
            $table->json('house_rules_snapshot')->nullable()->after('terms_and_conditions');
            $table->text('revision_request_note')->nullable()->after('house_rules_snapshot');
            $table->json('structured_clauses')->nullable()->after('revision_request_note');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('contract_versions', function (Blueprint $table) {
            $table->dropColumn([
                'advance_payment_months',
                'rent_due_day',
                'house_rules_snapshot',
                'revision_request_note',
                'structured_clauses',
            ]);
        });

        Schema::table('contracts', function (Blueprint $table) {
            $table->dropForeign(['viewing_request_id']);
            $table->dropForeign(['lawyer_inquiry_id']);
            $table->dropColumn([
                'viewing_request_id',
                'lawyer_inquiry_id',
                'owner_signed_at',
                'tenant_signed_at',
                'activated_at',
                'termination_reason',
            ]);
        });
    }
};
