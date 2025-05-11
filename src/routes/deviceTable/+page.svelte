<script lang="ts">
	import { goto } from '$app/navigation';

	// Sample data
	const devices = [
		{
			id: 'dev1',
			name: 'Sensor Alpha',
			status: 'Online',
			address: '123 Main St',
			city: 'Metropolis',
			createdAt: '2025-05-01'
		},
		{
			id: 'dev2',
			name: 'Camera Beta',
			status: 'Offline',
			address: '456 Oak Ave',
			city: 'Gotham',
			createdAt: '2025-04-22'
		}
	];

	function goToDevice(id: string) {
		goto(`/deviceTable/${id}`);
	}
</script>

<h1>Device Table Tester</h1>





<table border="1" cellpadding="8" cellspacing="0">
	<thead>
		<tr>
			<th>Device Name</th>
			<th>Status</th>
			<th>Street Address</th>
			<th>City</th>
			<th>Created At</th>
			<th>Actions</th>
		</tr>
	</thead>
	<tbody>
		{#each devices as device}
			<tr>
				<td>{device.name}</td>
				<td>{device.status}</td>
				<td>{device.address}</td>
				<td>{device.city}</td>
				<td>{device.createdAt}</td>
				<td>
					<button on:click={() => goToDevice(device.id)}>
						View
					</button>
				</td>
			</tr>
		{/each}
	</tbody>
</table>
