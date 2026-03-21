import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';
import { DoctorsService } from './doctors.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { SetAvailabilityDto } from './dto/set-availability.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Doctors')
@Controller('doctors')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all doctors (public, with filters)' })
  @ApiQuery({ name: 'specialization', required: false })
  @ApiQuery({ name: 'city', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async findAll(
    @Query('specialization') specialization?: string,
    @Query('city') city?: string,
    @Query('search') search?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    const { doctors, total } = await this.doctorsService.findWithFilters({
      specialization,
      city,
      search,
      page,
      limit,
    });

    return {
      data: doctors,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrevious: page > 1,
      },
    };
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get doctor by ID' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.doctorsService.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a doctor profile (admin only)' })
  async create(@Body() createDoctorDto: CreateDoctorDto) {
    return this.doctorsService.create(createDoctorDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'DOCTOR')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update doctor profile' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDoctorDto: UpdateDoctorDto,
  ) {
    return this.doctorsService.update(id, updateDoctorDto);
  }

  @Post(':id/availability')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'DOCTOR')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Set doctor availability schedule' })
  async setAvailability(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() setAvailabilityDto: SetAvailabilityDto,
  ) {
    return this.doctorsService.setAvailability(id, setAvailabilityDto);
  }

  @Get(':id/slots')
  @Public()
  @ApiOperation({ summary: 'Get available slots for a doctor on a date' })
  @ApiQuery({ name: 'date', required: true, example: '2026-03-25' })
  async getAvailableSlots(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('date') date: string,
  ) {
    return this.doctorsService.getAvailableSlots(id, date);
  }
}
