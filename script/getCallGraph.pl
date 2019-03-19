use Understand;
use strict;
use Cwd;

my $dir = getcwd;
my $proj = $ARGV[0];

my $path = $dir."/result/".$proj."/understand";

my $udb_dir = $path."/MyUnderstandProject.udb";
my $func_info_dir = $path."/func_info.json";
my $call_info_dir = $path."/call_info.json";


(my $db, my $status) = Understand::open($udb_dir);
if(!$db)
{
	die "Error opening .udb database: $status\n" if $status;
}

my @ents = $db->ents("function ~unknown ~unresolved");


open FILE, ">$func_info_dir";
# print FILE "id,kind,name,file,start_line,end_line\n";
print FILE "[";

my $i = 0;
foreach my $ent (@ents)
{
	my $define_ref = $ent->ref("definein");
	next unless(defined $define_ref);

	my $end_ref = $ent->ref("endby");
	next unless(defined $end_ref);

	my $id = $ent -> id();
	my $kind = $ent->kind()->longname();
	my $name = $ent->longname();
	
	my $file = $define_ref->file->longname();
	$file =~ s/\\/\//g;

	# my @parameters = ();
	# my @refs = $ent->refs("define");
	# foreach my $ref(@refs)
	# {
	# 	if ($ref) {
	# 		push(@parameters, $ref->ent->name());
	# 		# print($ref->ent->name(), " ");
	# 	}
	# }
	
	my $start_line = $define_ref->line();
	my $end_line = $end_ref->line();

	

	# print FILE "$id,$kind,$name,$file,$start_line,$end_line,\n";
	if($i != 0) {
		print FILE ",";
	}
	print FILE "{\"id\":$id,\"kind\":\"$kind\",\"name\":\"$name\",\"file\":\"$file\",\"start_line\":$start_line,\"end_line\":$end_line}";
	$i++;

}
print FILE "]";
close(FILE);


open FILE, ">$call_info_dir";
# print FILE "id,name,file,call_func_id,call_func_name,call_kind,line,column,\n";
print FILE "[";

my $i = 0;
foreach my $ent (@ents)
{
	my $define_ref = $ent->ref("definein");
	next unless(defined $define_ref);

	my $end_ref = $ent->ref("endby");
	next unless(defined $end_ref);

	my $id = $ent -> id();
	my $kind = $ent->kind()->longname();
	my $name = $ent->longname();

	my $file = $define_ref->file->longname();
	$file =~ s/\\/\//g;

	my @refs = $ent->refs("Call");

	foreach my $ref(@refs)
	{
		my $ref_kind = $ref->kind->longname();
		my $ref_ent_id = $ref->ent->id();
		my $ref_ent_name = $ref->ent->name();
		my $line = $ref->line();
		my $column = $ref->column();

		if($i != 0) {
			print FILE ",";
		}
		# print FILE "$id,$name,$file,$ref_ent_id,$ref_ent_name,$ref_kind,$line,$column\n";
		print FILE "{\"id\":$id,\"name\":\"$name\",\"file\":\"$file\",\"call_func_id\":\"$ref_ent_id\",\"call_func_name\":\"$ref_ent_name\",\"call_kind\":\"$ref_kind\",\"line\":$line,\"column\":$column}";
		$i++;
	}

}

print FILE "]";
close(FILE);
$db->close();

